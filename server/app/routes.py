from flask import Blueprint, request , jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app.extension import db, limiter, mail
from app.model import User , UserLoginLog , MorningUpdate , MorningTask , EveningUpdate , EveningTask , TaskAssignment,EmployeePerformance,Project
from datetime import datetime, timedelta
import os
from random import randint
from flask_mail import Message

ph = PasswordHasher()
auth = Blueprint('auth', __name__)
employee = Blueprint('employee', __name__)
admin = Blueprint('admin', __name__)
spradmin = Blueprint('spradmin', __name__)

otp_store = {}

@auth.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test"}), 200

@auth.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def user_register():
    try:
        data = request.json
        required_fields = ["name", "role", "username", "email", 'password']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered"}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists. Please choose a different one"}), 400
        
        hashed_password = ph.hash(data['password'])
        if data['role'] in ["admin", "superadmin"]:
            otp = str(randint(1000, 9999))
            otp_store[data['email']] = {
                "otp": otp,
                "timestamp": datetime.now()
            }
            print(otp_store)
            msg = Message(
                subject=f"New Registration Request from {data['email']}",
                sender=os.environ.get('MAIL_USERNAME'),
                # recipients=["dharshagan@vijratechnology.com"],
                recipients=["dharshagan@vijratechnology.com"],
                body = f"""
Registration Authority,

       A new registration request has been initiated with the following details:
                              
       🔹 Full Name  : {data['name']}  
       🔹 Username   : {data['username']} 
       🔹 Email      : {data['email']}  
       🔹 Role       : {data['role']}                

       An OTP verification has been initiated for this user.  🔐 OTP for verification: {otp}

       Regards,  
       {data['name']}
       """
            )
            mail.send(msg)

            return jsonify({
                "message": "OTP sent to email. Please verify to complete registration.",
                "email": data["email"]
            }), 202
        
        new_user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            password_hash=hashed_password,
            username=data['username'],
            status=data.get('status') if data.get('status') else None
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400 
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@auth.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get("email")
        otp = data.get("otp")
        name = data.get("name")
        role = data.get("role")
        username = data.get("username")
        password = data.get("password")

        # Validate inputs
        if not all([email, otp, name, role, username, password]):
            return jsonify({"error": "Missing required fields"}), 400

        if email not in otp_store:
            return jsonify({"error": "OTP not sent or expired"}), 400

        stored_otp_info = otp_store.get(email)
        stored_otp = stored_otp_info["otp"]
        timestamp = stored_otp_info["timestamp"]

        # Check if OTP expired (valid for 5 minutes)
        if datetime.now() - timestamp > timedelta(minutes=5):
            del otp_store[email]
            return jsonify({"error": "OTP expired"}), 400

        # Check if OTP matches
        if str(otp).strip() != str(stored_otp).strip():
           print("OTP mismatch:", repr(otp), repr(stored_otp))
           return jsonify({"error": "Invalid OTP"}), 400

        # OTP is valid — create user
        hashed_password = ph.hash(password)

        new_user = User(
            name=name,
            email=email,
            role=role,
            password_hash=hashed_password,
            username=username,
            status=data.get('status') if data.get('status') else None
        )
        db.session.add(new_user)
        db.session.commit()

        # Remove OTP after successful registration
        del otp_store[email]

        return jsonify({"message": "User verified and created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    

@auth.route('forgetpswd/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(role = "admin").first()
    if not user:
        return jsonify({"message":"admin Note Found"}) , 400
    if not email:
        return jsonify({'message': 'Email required'}), 400
    
    admin = User.query.filter_by(email=email).first()
    if not admin:
        return jsonify({"error": "Admin not found"}), 404
    otp = str(randint(1000, 9999))
    otp_store[email] = {'otp': otp, 'timestamp': datetime.now() }  # Store OTP temporarily

    try:
        msg = Message('Your OTP for Password Reset', sender=os.environ.get('MAIL_USERNAME'), recipients=[user.email])
        msg.body = f'Your OTP is {otp}'
        mail.send(msg)
        return jsonify({'message': 'OTP sent successfully'})
    except Exception as e:
        return jsonify({'message': 'Failed to send OTP', 'error': str(e)}), 500

@auth.route('/forgetpswd/verify-otp', methods=['POST'])
def emp_verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({'message': 'Email and OTP required'}), 400

    stored_otp_info = otp_store.get(email)
    stored_otp = stored_otp_info["otp"]
    timestamp = stored_otp_info["timestamp"]

    if datetime.now() - timestamp > timedelta(minutes=5):
            del otp_store[email]
            return jsonify({"error": "OTP expired"}), 400
    
    if otp != stored_otp:
        return jsonify({"error": "Invalid OTP"}), 400
    # Check OTP match
    if stored_otp == otp:
        otp_store.pop(email, None)  # Remove OTP after successful verification
        return jsonify({'message': 'OTP verified successfully'})
    else:
        return jsonify({'message': 'Invalid OTP'}), 400
    

@auth.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('password')
    admin = User.query.filter_by(email=email).first()
    print(admin)
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    hashed_password = ph.hash(new_password)
    admin.password_hash = hashed_password
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200
    

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
        else:
            return jsonify({"message": "Invalid Cerential" }) , 400
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

        if 'checkOut' not in data:
            return jsonify({"error": "Missing checkOut field"}), 400

        check_out_time = datetime.fromisoformat(data['checkOut'])

        user = User.query.filter_by(user_id=user_id).first()
        if user.role == "employee":
            # Find the oldest open session (optional: restrict to today)
            open_log = UserLoginLog.query.filter_by(
                user_id=user_id,
                logout_datetime=None
            ).order_by(UserLoginLog.login_datetime.asc()).first()

            if not open_log:
                return jsonify({"error": "No active session found"}), 404

            open_log.logout_datetime = check_out_time
            db.session.commit()

            return jsonify({"message": "Session Logout successful"}), 200

        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    


    
@employee.route('/add/permission', methods=['PUT'])
@jwt_required()
def addpermission():
    try:
        user_id = get_jwt_identity()
        data = request.json
        if 'permission_type' not in data:
            return jsonify({"message":"Permission Type is required"}),400
        
        open_log = UserLoginLog.query.filter_by(user_id=user_id,).first()
        if not open_log:
            return jsonify({"error": "User Not Found"}), 404
        if data['permission_type'] == 'leave' :
            open_log.leave= True
        if data['permission_type'] == 'permission' :
            open_log.permission= True

        db.session.commit()

        return jsonify({"message": "Permission Added"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@employee.route('/all-employees', methods=['GET'])
@jwt_required()
def get_all_employees():
    try:
        employees = User.query.all()

        result = [
            {
              "id": emp.user_id,
              "full_name": emp.name,
              'role':emp.role,
              'username':emp.username,
              'email':emp.email,
              'status':emp.status if emp.status else None 
            }
           for emp in employees
           if emp.role in ["admin", "employee"]
        ]
        return jsonify({"employees":result}), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    
@spradmin.route('/update-employee/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_employee(user_id):
    try:
        data = request.json
        admin_id = get_jwt_identity()
        user= User.query.filter_by(user_id = admin_id).first()
        if user.role == "superadmin":
          emp = User.query.get(user_id)
          if not emp:
            return jsonify({"error": "Employee not found"}), 404

          # Update fields only if they exist in the request
          emp.name = data.get("full_name", emp.name)
          emp.role = data.get("role", emp.role)
          emp.username = data.get("username", emp.username)
          emp.email = data.get("email", emp.email)
          emp.status = data.get("status", emp.status)
          db.session.commit()
          return jsonify({"message": "Employee updated successfully"}), 200
        else:
          return jsonify({"message": "Unauthorized To edit Employee Data"}), 401

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed", "details": str(e)}), 500

@admin.route('/update-employee-status', methods=['PUT'])
@jwt_required()
def update_employee():
    try:
        data = request.json
        email = data.get('email')
        username = data.get('username')
        status = data.get('status')
        admin_id = get_jwt_identity()
        user= User.query.filter_by(user_id = admin_id).first()
        if user.role == "admin":
          emp = User.query.filter_by(email = email).first()
          if not emp:
            return jsonify({"error": "Employee not found"}), 404
          # Update fields only if they exist in the request
          emp.status = data.get("status", emp.status)
          db.session.commit()
          return jsonify({"message": "Employee updated successfully"}), 200
        else:
          return jsonify({"message": "Unauthorized To edit Employee Data"}), 401

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed", "details": str(e)}), 500
    
@spradmin.route('/delete-employee/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(user_id):
    try:
        admin_id = get_jwt_identity()
        user= User.query.filter_by(user_id = admin_id).first()
        if user.role == "superadmin":
           user = User.query.get(user_id)
           if not user:
              return jsonify({"error": "User not found"}), 404
           UserLoginLog.query.filter_by(user_id=user_id).delete()

           db.session.delete(user)
           db.session.commit()
           return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"message": "UnAuthorized to delete user"}), 401

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete user", "details": str(e)}), 500
     
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
             filter_date_obj = datetime.strptime(data, "%Y-%m-%d")
             start_of_month = filter_date_obj.replace(day=1)
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
                        if first_login > datetime.strptime("09:15", "%H:%M").time():  #login_time
                            late_arrival = 1
                     # ✅ Get performance_percentage from EveningUpdate for that date
                    performance_percentage = EmployeePerformance.query.filter_by(employee_id=user.user_id, date=datetime.strptime(data, "%Y-%m-%d").date()).first()
                    performance = performance_percentage.performance_percentage if performance_percentage else None

                    checkins = [s[0].strftime('%I:%M %p') for s in sessions]
                    checkouts = [s[1].strftime('%I:%M %p') if s[1] else None for s in sessions]
                    total_leave_count = UserLoginLog.query.filter(
                          UserLoginLog.user_id == user.user_id,
                          UserLoginLog.login_date >= start_of_month.date(),
                          UserLoginLog.login_date <= filter_date_obj.date(),
                          UserLoginLog.leave == True
                         ).count()
                    total_permission_count = UserLoginLog.query.filter(
                          UserLoginLog.user_id == user.user_id,
                          UserLoginLog.login_date >= start_of_month.date(),
                          UserLoginLog.login_date <= filter_date_obj.date(),
                          UserLoginLog.permission == True
                         ).count()
                    overall_leave_count = total_leave_count + (total_permission_count // 4)
                    leave_log = UserLoginLog.query.filter_by(user_id=user.user_id, login_date=data, leave=True).first()

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
                        "is_leave": leave_log is not None,
                        "is_permission": any(log.permission for log in logs),
                        'user_status':user.status,
                        "working_hours": round(working_hours, 2),
                        "shortage_hours": round(shortage, 2),
                        "late_arrival": late_arrival,
                        "permission": total_permission_count,
                        "leave": total_leave_count,   
                        "overall_leave_count": overall_leave_count  
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
    
    
@employee.route("/get/morning-task", methods=['GET'])
@jwt_required()
def get_morning_task():
    try:
        employee_id = get_jwt_identity()
        date_str = request.args.get("date")  # use ?date=YYYY-MM-DD in URL

        if not date_str:
            return jsonify({"error": "Missing date parameter"}), 400

        target_date = datetime.fromisoformat(date_str).date()

        # Get the morning update for this employee and date
        morning_update = MorningUpdate.query.filter_by(
            employee_id=employee_id,
            date=target_date
        ).first()

        if not morning_update:
            return jsonify({"message": "Morning update not found"}), 404

        tasks = [
            {
                "project_type": task.project_type,
                "project_title": task.project_title,
                "project_description": task.project_description,
                "book_isbn": task.book_isbn,
                "total_pages": task.total_pages,
                "target_pages": task.target_pages,
                "start_date": task.start_date.strftime("%Y-%m-%d") if task.start_date else None,
                "due_date": task.due_date.strftime("%Y-%m-%d") if task.due_date else None,
            }
            for task in morning_update.tasks
        ]

        return jsonify({"tasks": tasks}), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

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

@spradmin.route('/get_performance', methods=['GET'])
@jwt_required()
def getemp_performance():
    try:
        # performances = EmployeePerformance.query.all()
        filter_date = request.args.get('filter_date')

        if not filter_date:
            return jsonify({"error": "Missing 'filter_date' parameter"}), 400

        try:
            parsed_date = datetime.strptime(filter_date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        users = User.query.all()
        result = []

        for user in users:
          if user.role == "employee": 
            perf = EmployeePerformance.query.filter_by(employee_id=user.user_id, date=parsed_date).first()
            
            result.append({
                "id": perf.id if perf else None,
                "employee_id": user.user_id,
                "employee_name": user.name,
                "date": filter_date,
                "performance_percentage": perf.performance_percentage if perf else 0,
                "created_at": perf.created_at.strftime("%Y-%m-%d %H:%M:%S") if perf else None
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@employee.route('/emp/get_performance', methods=['GET'])
@jwt_required()
def get_emp_personalperformance():
    try:
        employee_id = get_jwt_identity()
        date= request.args.get('filter_date')
        performance = EmployeePerformance.query.filter_by(employee_id=employee_id, date=date).first()

        if performance:
            return jsonify({
                "message": "Performance fetched successfully",
                "data": {
                    "employee_id": performance.employee_id,
                    "date": performance.date.strftime("%Y-%m-%d"),
                    "performance_percentage": performance.performance_percentage
                }
            }), 200
        else:
            return jsonify({
                "message": "Performance fetched successfully",
                "data": {
                    "employee_id": employee_id,
                    "date": date,
                    "performance_percentage": 0
                }
            }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@auth.route('/get_user_name', methods=['GET'])
@jwt_required()
def getuser_name():
    try:
        user_id = get_jwt_identity()

        user = User.query.filter_by(user_id = user_id).first()

        return jsonify({"username":user.username}), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@employee.route("/progress-report", methods=["GET"])
@jwt_required()
def project_progress_report():
    try:
        report = []
        data = request.args.get('filter_date')

        if not data:
            return jsonify({"error": "Missing date"}), 400

        users = User.query.filter_by(role="employee").all()

        for user in users:
            emp_tasks = []
                # ✅ Fetch logs once per employee
            logs = UserLoginLog.query.filter_by(user_id=user.user_id, login_date=data).order_by(UserLoginLog.login_datetime.asc()).all()
            leave_log = UserLoginLog.query.filter_by(user_id=user.user_id, login_date=data, leave=True).first()
            in_time = logs[0].login_datetime.strftime("%I:%M %p") if logs and logs[0].login_datetime else None
            out_time = logs[-1].logout_datetime.strftime("%I:%M %p") if logs and logs[-1].logout_datetime else None
 
            # Fetch morning updates
            morning_updates = MorningUpdate.query.filter_by(employee_id=user.user_id, date=data).all()

            for m_update in morning_updates:
                for task in m_update.tasks:
                    task_data = {
                        "project": task.project_type,
                        "title": task.project_title,
                        "isbn": f"{task.book_isbn}.epub" if task.book_isbn else None,
                        "start_date": task.start_date.strftime("%d/%m/%Y") if task.start_date else None,
                        "due_date": task.due_date.strftime("%d/%m/%Y") if task.due_date else None,
                        "end_date": None,
                        "pages": task.total_pages or 0,
                        "target": task.target_pages or 0,
                        "completed": 0,
                        "pending": 0,
                        "status": 0,
                        "incomplete_topics": [],
                    }

                    # Evening task match
                    evening_task = None
                    e_update = EveningUpdate.query.filter_by(employee_id=user.user_id, date=m_update.date).first()
                    if e_update:
                        evening_task = next(
                            (et for et in e_update.tasks if
                            et.book_isbn == task.book_isbn or
                            et.project_title.lower() == task.project_title.lower()),
                            None
                        )

                    if evening_task:
                        task_data["end_date"] = evening_task.end_date.strftime("%d/%m/%Y") if evening_task.end_date else None
                        task_data["completed"] = evening_task.completed_pages or 0
                        task_data["pending"] = evening_task.incompleted_pages or 0
                        task_data["status"] = sum([
                            int(evening_task.is_contentext_pending),
                            int(evening_task.is_qc_pending),
                            int(evening_task.is_compare_pending),
                            int(evening_task.is_styleview_pending),
                            int(evening_task.is_packagecreate_pending),
                            int(evening_task.is_validation_pending),
                        ])
                        task_data["incomplete_topics"] = [
                            name for flag, name in [
                                (evening_task.is_contentext_pending, "Content Extraction"),
                                (evening_task.is_qc_pending, "QC"),
                                (evening_task.is_compare_pending, "Compare"),
                                (evening_task.is_styleview_pending, "Style View"),
                                (evening_task.is_packagecreate_pending, "Package Create"),
                                (evening_task.is_validation_pending, "Validation"),
                            ] if flag
                        ]

                    # Get login/out times


                    emp_tasks.append(task_data)

            report.append({
                "employee_id": user.user_id,
                "employee_name": user.name,
                "tasks": emp_tasks,
                "in_time": in_time, 
                "out_time": out_time ,
                'is_leave':leave_log is not None,
                'user_status':user.status,
            })

        return jsonify(report)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@spradmin.route('/update-attendance', methods=['PUT'])
@jwt_required()
def update_attendance():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        login_date_str = data.get("login_date")
        performance_percentage = data.get("performance_percentage")
        logs = data.get("logs")

        if not user_id or not login_date_str or logs is None:
            return jsonify({"error": "Missing required fields"}), 400

        login_date = datetime.strptime(login_date_str, "%Y-%m-%d").date()

        # Delete existing login logs for that date
        UserLoginLog.query.filter_by(user_id=user_id, login_date=login_date).delete()

        for log in logs:
            checkin = log.get("checkin")
            checkout = log.get("checkout")

            if not checkin:
                continue  # skip if empty check-in

            login_datetime = datetime.strptime(f"{login_date_str} {checkin}", "%Y-%m-%d %I:%M %p")
            logout_datetime = None
            if checkout:
                logout_datetime = datetime.strptime(f"{login_date_str} {checkout}", "%Y-%m-%d %I:%M %p")

            new_log = UserLoginLog(
                user_id=user_id,
                login_date=login_date,
                login_datetime=login_datetime,
                logout_datetime=logout_datetime,
                leave=False,
                permission=False
            )
            db.session.add(new_log)

        # Optional: Update performance
        performance_entry = EmployeePerformance.query.filter_by(employee_id=user_id, date=login_date).first()
        if performance_entry:
            performance_entry.performance_percentage = performance_percentage
        else:
            new_perf = EmployeePerformance(
                employee_id=user_id,
                date=login_date,
                performance_percentage=performance_percentage
            )
            db.session.add(new_perf)

        db.session.commit()
        return jsonify({"message": "Attendance updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



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
            project_type = task_data.get("ProjectType")
            source = task_data.get("source", "assign")

            # Basic validation
            if not all([employee_id, book_isbn, book_title]):
                return jsonify({"error": f"Missing required fields in one of the tasks"}), 400

            # Convert string to date if present
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date() if due_date else None

            task = TaskAssignment(
                employee_id=employee_id,
                project_type=project_type,
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
    
@employee.route('/remove/assign-task', methods=['DELETE'])
@jwt_required()
def del_assign_task():
    try:
        data = request.json
        print(data)
        task_id = data.get("task_id")
        employee_id = get_jwt_identity()

        if task_id and employee_id:
            task = TaskAssignment.query.filter_by(task_id=task_id , employee_id=employee_id).first()
        else:
            return jsonify({"error": "Either 'task_id' or 'employee_id' is required"}), 400

        if not task:
            return jsonify({"error": "No matching task found"}), 404

        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task removed successfully"}), 200

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
                "Project_type": task.project_type,
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


@admin.route('/add/project', methods=['POST'])
@jwt_required()
def add_project():
    try:
        data = request.json

        required_fields = ['project_title', 'client_name', 'book_isbn', 'total_pages', 'project_date', 'type']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_project = Project(
            project_title=data['project_title'],
            client_name=data['client_name'],
            book_isbn=data['book_isbn'],
            total_pages=data['total_pages'],
            project_date=datetime.strptime(data['project_date'], "%Y-%m-%d").date(),
            type=data['type']
        )

        db.session.add(new_project)
        db.session.commit()

        return jsonify({"message": "Project added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add project", "details": str(e)}), 500
    
@spradmin.route('/get/projects', methods=['GET'])
@jwt_required()
def get_projects():
    try:
        projects = Project.query.order_by(Project.project_date.desc()).all()
        result = []
        for p in projects:
            result.append({
                "project_id": p.id,
                "project_title": p.project_title,
                "client_name": p.client_name,
                "book_isbn": p.book_isbn,
                "total_pages": p.total_pages,
                "project_date": p.project_date.strftime("%Y-%m-%d"),
                "type": p.type
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch projects", "details": str(e)}), 500