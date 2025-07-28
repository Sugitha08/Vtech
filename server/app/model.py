from app.extension import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False) 
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    check_in_time = db.Column(db.Time, nullable=True)
    check_out_time = db.Column(db.Time, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class UserLoginLog(db.Model):
    __tablename__ = 'user_login_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    login_datetime = db.Column(db.DateTime, nullable=False)
    logout_datetime = db.Column(db.DateTime, nullable=True)
    login_date = db.Column(db.Date, nullable=False) 

    user = db.relationship('User', backref='login_sessions')

class MorningUpdate(db.Model):
    __tablename__ = 'morning_updates'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to tasks
    tasks = db.relationship('MorningTask', backref='morning_update', cascade="all, delete-orphan", lazy=True)


class MorningTask(db.Model):
    __tablename__ = 'morning_tasks'

    id = db.Column(db.Integer, primary_key=True)
    morning_update_id = db.Column(db.Integer, db.ForeignKey('morning_updates.id'), nullable=False)
    project_type = db.Column(db.String(100))
    project_title = db.Column(db.String(200))
    project_description = db.Column(db.String(200))
    book_isbn = db.Column(db.Integer)
    total_pages = db.Column(db.Integer)
    target_pages = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    due_date = db.Column(db.Date)



class EveningUpdate(db.Model):
    __tablename__ = 'evening_updates'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to tasks
    tasks = db.relationship('EveningTask', backref='evening_update', cascade="all, delete-orphan", lazy=True)


class EveningTask(db.Model):
    __tablename__ = 'evening_tasks'

    id = db.Column(db.Integer, primary_key=True)
    evening_update_id = db.Column(db.Integer, db.ForeignKey('evening_updates.id'), nullable=False)
    project_title = db.Column(db.String(200))
    book_isbn = db.Column(db.Integer)
    completed_pages = db.Column(db.Integer)
    incompleted_pages = db.Column(db.Integer)
    end_date = db.Column(db.Date)
    is_contentext_pending = db.Column(db.Boolean, default=False)
    is_styleview_pending = db.Column(db.Boolean, default=False)
    is_packagecreate_pending = db.Column(db.Boolean, default=False)
    is_validation_pending = db.Column(db.Boolean, default=False)
    is_compare_pending = db.Column(db.Boolean, default=False)
    is_qc_pending = db.Column(db.Boolean, default=False)

class EmployeePerformance(db.Model):
    __tablename__ = 'employee_performances'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    performance_percentage = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship('User', backref='performances')


class TaskAssignment(db.Model):
    __tablename__ = 'task_assignments'

    task_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    book_isbn = db.Column(db.String(50), nullable=False)
    book_title = db.Column(db.String(100), nullable=False)
    target_pages = db.Column(db.Integer, nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    due_date = db.Column(db.Date, nullable=True)
    task_note = db.Column(db.Text, nullable=True)
    source = db.Column(db.String(50), nullable=False, default="assign") 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
