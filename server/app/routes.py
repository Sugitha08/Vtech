from flask import Blueprint, request , jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app.extension import db, limiter
from app.model import User , UserLoginLog , MorningUpdate , MorningTask , EveningUpdate , EveningTask , TaskAssignment,EmployeePerformance
from datetime import datetime
import os

ph = PasswordHasher()
auth = Blueprint('auth', __name__)
employee = Blueprint('employee', __name__)
admin = Blueprint('admin', __name__)
spradmin = Blueprint('spradmin', __name__)

@auth.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def user_register():
    try:
        data = request.json
        required_fields = ["name", "role", "username", "email", 'password', 'checkIn' , 'checkOut']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered"}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists. Please choose a different one"}), 400
        
        hashed_password = ph.hash(data['password'])
        check_in = datetime.strptime(data['checkIn'], "%I:%M %p").time()
        check_out = datetime.strptime(data['checkOut'], "%I:%M %p").time()

        new_user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            password_hash=hashed_password,
            username=data['username'],
            check_in_time=check_in,
            check_out_time=check_out,
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    

@auth.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def user_login():
    try:
        data = request.json
        required_fields = ["username", 'password', 'checkIn','date']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        user = User.query.filter_by(username=data['username']).first()

        if not user:
            return jsonify({"error":"Invalid username"}), 401
        
        if ph.verify(user.password_hash , data['password']):
            access_token = create_access_token(identity=str(user.user_id))
            login_date = datetime.strptime(data['date'], "%d/%m/%Y").date()
            check_in_time = datetime.strptime(data['checkIn'], "%H:%M:%S").time()
            login_datetime = datetime.combine(login_date, check_in_time)
            if user.role =="employee":
                 log = UserLoginLog(
                 user_id= user.user_id,
                 login_date=login_date,
                 login_datetime=login_datetime 
                 ) 
                 db.session.add(log)
                 db.session.commit()

            return jsonify({"access_token":access_token , "message": "Login successful" , "role":user.role })
          
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
     try:
        user_id = get_jwt_identity()
        data = request.json
        user = User.query.filter_by(user_id = user_id).first()
        if user.role == "employee":
            if 'checkOut' not in data:
             return jsonify({"error": "Missing checkOut field"}), 400
        
            check_out_time = datetime.fromisoformat(data['checkOut'])

            log = UserLoginLog.query.filter_by(user_id=user_id, logout_datetime=None).order_by(UserLoginLog.login_datetime.desc()).first()
            if not log:
              return jsonify({"error": "No active session found"}), 404
            log.logout_datetime = check_out_time
            db.session.commit()
            return jsonify({"message": "Session Logout successful"}), 200
        return jsonify({"message": "Session Logout successful"}), 200
     
     except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
     except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@employee.route('/all-employees', methods=['GET'])
@jwt_required()
def get_all_employees():
    try:
        employees = User.query.filter_by(role="employee").all()

        result = [
            {
                "id": emp.user_id,
                "name": emp.name
            } for emp in employees
        ]
        return jsonify({"employees":result}), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
     
@employee.route('/emp-attendance', methods=['GET'])
@jwt_required()
def emp_attendance():
    try:      
      data = request.args.get('filter_date') 
      if not data:
         return jsonify({"error": "Missing date"}), 400
      user_id = get_jwt_identity()
      user = User.query.filter_by(user_id = user_id).first()
      if user.role in ["admin", "superadmin"]:
    #   if user.role == "admin" and user.role == "superadmin":
             all_users = User.query.all()
             summaries = []
             for user in all_users:
                if user.role == "employee":    
                    logs = UserLoginLog.query.filter_by(user_id=user.user_id, login_date=data).order_by(UserLoginLog.login_datetime).all()

                    sessions = [(log.login_datetime, log.logout_datetime) for log in logs]

                    working_hours = sum(
                            [((logout if logout else datetime.now()) - login).total_seconds() / 3600 for login, logout in sessions],
                            0
                    )

                    shortage = max(0, 8 - working_hours)

                    late_arrival = 0
                    if sessions:
                        first_login = sessions[0][0].time()
                        if first_login > datetime.strptime("09:30", "%H:%M").time():  #login_time
                            late_arrival = 1
                     # ✅ Get performance_percentage from EveningUpdate for that date
                    performance_percentage = EmployeePerformance.query.filter_by(employee_id=user.user_id, date=datetime.strptime(data, "%Y-%m-%d").date()).first()
                    performance = performance_percentage.performance_percentage if performance_percentage else None

                    checkins = [s[0].strftime('%I:%M %p') for s in sessions]
                    checkouts = [s[1].strftime('%I:%M %p') if s[1] else "working" for s in sessions]

                    summaries.append({
                        'employee_id':user.user_id,
                        "employee_name": user.name,
                        "performance_percentage": performance,
                        "checkin_1": checkins[0] if len(checkins) > 0 else None,
                        "checkout_1": checkouts[0] if len(checkouts) > 0 else None,
                        "checkin_2": checkins[1] if len(checkins) > 1 else None,
                        "checkout_2": checkouts[1] if len(checkouts) > 1 else None,
                        "checkin_3": checkins[2] if len(checkins) > 2 else None,
                        "checkout_3": checkouts[2] if len(checkouts) > 2 else None,
                        "working_hours": round(working_hours, 2),
                        "shortage_hours": round(shortage, 2),
                        "late_arrival": late_arrival,
                        "permission": 0,
                        "leave": 0,     
                    })

             return summaries
      else:
          return jsonify({"error":"Unauthorized User"})
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@employee.route("/morning-task" , methods=['POST'])
@jwt_required()
def create_morning_task():
    try:
         data = request.json
         employee_id = get_jwt_identity()
         tasks_data = data.get('tasks')

         if not employee_id or not tasks_data or not isinstance(tasks_data, list):
            return jsonify({"error": "Invalid data"}), 400
         date_str = data.get("date")
         if date_str:
            today_date = datetime.fromisoformat(date_str).date()
         else:
            today_date = datetime.utcnow().date()

        # Check or create MorningUpdate
         morning_update = MorningUpdate.query.filter_by(employee_id=employee_id, date=today_date).first()
         if not morning_update:
            morning_update = MorningUpdate(
                employee_id=employee_id,
                date=today_date
            )
            db.session.add(morning_update)
            db.session.flush()  # To get morning_update.id

         # Loop through each task and create it
         for task_data in tasks_data:
            task = MorningTask(
                morning_update_id=morning_update.id,
                project_type=task_data.get('project_type'),
                project_title=task_data.get('project_title'),
                project_description=task_data.get('project_description'),
                book_isbn=task_data.get('book_isbn'),
                total_pages=task_data.get('total_pages'),
                target_pages=task_data.get('target_pages'),
                start_date=task_data.get('start_date'),
                due_date=task_data.get('due_date')
            )
            db.session.add(task)

         db.session.commit()
         return jsonify({"message": "Morning plan submitted successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@employee.route("/evening-task" , methods=['POST'])
@jwt_required()
def create_evening_task():
    try:
         data = request.json
         employee_id = get_jwt_identity()
         tasks_data = data.get('tasks')

         if not employee_id or not tasks_data or not isinstance(tasks_data, list):
            return jsonify({"error": "Invalid data"}), 400
         date_str = data.get("date")
         if date_str:
            today_date = datetime.fromisoformat(date_str).date()
         else:
            today_date = datetime.utcnow().date()   

        # Check or create MorningUpdate
         evening_update = EveningUpdate.query.filter_by(employee_id=employee_id, date=today_date).first()
         if not evening_update:
            evening_update = EveningUpdate(
                employee_id=employee_id,
                date=today_date
            )
            db.session.add(evening_update)
            db.session.flush()

         for task_data in tasks_data:
            task = EveningTask(
                evening_update_id=evening_update.id,
                project_title=task_data.get('project_title'),
                book_isbn=task_data.get('book_isbn'),
                completed_pages=task_data.get('completed_pages'),
                incompleted_pages=task_data.get('incompleted_pages'),
                end_date=task_data.get('end_date'),
                is_contentext_pending =  bool(task_data.get('is_contentExt_pending', False)),
                is_styleview_pending = bool(task_data.get('is_styleview_pending', False)),
                is_packagecreate_pending = bool(task_data.get('is_packagecreate_pending', False)),
                is_validation_pending = bool(task_data.get('is_validation_pending', False)),
                is_compare_pending = bool(task_data.get('is_compare_pending', False)),
                is_qc_pending = bool(task_data.get('is_qc_pending', False))
            )
            db.session.add(task)

         db.session.commit()
         return jsonify({"message": "Evening plan submitted successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@admin.route('/assign-performance', methods=['POST'])
@jwt_required()
def assign_performance():
    try:
        data = request.json
        emp_performances = data.get('emp_performance')  # expecting a list of {employee_id, date, performance_percentage}

        if not emp_performances or not isinstance(emp_performances, list):
            return jsonify({"error": "Invalid or missing emp_performance data"}), 400

        for record in emp_performances:
            employee_id = record.get("employee_id")
            date_str = record.get("date")
            performance = record.get("performance_percentage")
            if not employee_id or performance is None:
                return jsonify({"error": "Invalid data"}), 400
            try:
                date = datetime.fromisoformat(date_str).date()
            except ValueError:
                date = datetime.utcnow().date()

            existing = EmployeePerformance.query.filter_by(employee_id=employee_id, date=date).first()
            if existing:
                existing.performance_percentage = performance
            else:
                new_perf = EmployeePerformance(
                    employee_id=employee_id,
                    date=date,
                    performance_percentage=performance
                )
                db.session.add(new_perf)

        db.session.commit()
        return jsonify({"message": "Performance updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@employee.route("/progress-report", methods=["GET"])
@jwt_required()
def project_progress_report():
    report = []
    data = request.args.get('filter_date')
    users = User.query.all()
    if not data:
         return jsonify({"error": "Missing date"}), 400

    for user in users:
        morning_updates = MorningUpdate.query.filter_by(employee_id=user.user_id, date=data).all()
        
        for m_update in morning_updates:
            for task in m_update.tasks:
                # Get corresponding evening update (same employee & date)
                e_update = EveningUpdate.query.filter_by(employee_id=user.user_id, date=m_update.date).first()
                evening_tasks = e_update.tasks if e_update else []

                # Match evening task by ISBN (or title)
                evening_task = next((et for et in evening_tasks if et.book_isbn == task.book_isbn), None)

                completed = evening_task.completed_pages if evening_task else 0
                incompleted = evening_task.incompleted_pages if evening_task else 0

                pending_checks = 0
                status_count = 0
                if evening_task:
                    pending_checks += int(evening_task.is_contentext_pending)
                    pending_checks += int(evening_task.is_qc_pending)
                    pending_checks += int(evening_task.is_compare_pending)
                    pending_checks += int(evening_task.is_styleview_pending)
                    pending_checks += int(evening_task.is_packagecreate_pending)
                    pending_checks += int(evening_task.is_validation_pending)

                    status_count = sum([
                        int(evening_task.is_contentext_pending),
                        int(evening_task.is_qc_pending),
                        int(evening_task.is_compare_pending),
                    ])


                report.append({
                    "employee_id":user.user_id,
                    "employee_name": user.name,
                    "project": task.project_type,
                    "title": task.project_title,
                    "isbn": f"{task.book_isbn}.epub",
                    "start_date": task.start_date.strftime("%d/%m/%Y") if task.start_date else None,
                    "due_date": task.due_date.strftime("%d/%m/%Y") if task.due_date else None,
                    "end_date": evening_task.end_date.strftime("%d/%m/%Y") if evening_task and evening_task.end_date else None,
                    "pages": task.total_pages,
                    "target": task.target_pages,
                    "completed": completed,
                    "pending": incompleted or pending_checks,
                    "status": status_count,
                    "in_time": 1,   # You can get this from login log count
                    "out_time": 1   # Same
                })

    return jsonify(report)


@admin.route('/assign-task', methods=['POST'])
@jwt_required()
def assign_task():
    try:
        data = request.json
        tasks_to_assign = data.get('tasks')

        if not tasks_to_assign or not isinstance(tasks_to_assign, list):
            return jsonify({"error": "Invalid or missing 'tasks' array"}), 400

        for task_data in tasks_to_assign:
            employee_id = task_data.get("employee_id")
            book_isbn = task_data.get("book_isbn")
            book_title = task_data.get("book_title")
            target_pages = task_data.get("target_pages")
            start_date = task_data.get("start_date")
            due_date = task_data.get("due_date")
            task_note = task_data.get("task_note")
            source = task_data.get("source", "assign")

            # Basic validation
            if not all([employee_id, book_isbn, book_title]):
                return jsonify({"error": f"Missing required fields in one of the tasks"}), 400

            # Convert string to date if present
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date() if due_date else None

            task = TaskAssignment(
                employee_id=employee_id,
                book_isbn=book_isbn,
                book_title=book_title,
                target_pages=target_pages,
                start_date=start_date,
                due_date=due_date,
                task_note=task_note,
                source=source
            )
            db.session.add(task)

        db.session.commit()
        return jsonify({"message": "Tasks assigned successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    

@employee.route('/employee-tasks', methods=['GET'])
@jwt_required()
def get_tasks_by_employee():
    try:
        employee_id = get_jwt_identity()
        tasks = TaskAssignment.query.filter_by(employee_id=employee_id).all()

        result = [
            {
                "task_id": task.task_id,
                "book_isbn": task.book_isbn,
                "book_title": task.book_title,
                "target_pages": task.target_pages,
                "start_date": task.start_date.strftime("%Y-%m-%d") if task.start_date else None,
                "due_date": task.due_date.strftime("%Y-%m-%d") if task.due_date else None,
                "task_note": task.task_note,
                "source": task.source,
                "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for task in tasks
        ]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


