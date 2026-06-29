import os
import shutil
import pandas as pd
from app import app, db
from models import Student, Submission, DailySnapshot, Notification, WeeklyReport

def seed_classmates():
    with app.app_context():
        print("Clearing all existing database records...")
        # Reset database tables
        db.drop_all()
        db.create_all()
        print("Database schema reset successfully.")
        
        excel_path = os.path.join(app.root_path, 'uploads', 'students.xlsx')
        temp_excel_path = os.path.join(app.root_path, 'uploads', 'students_temp.xlsx')
        
        if os.path.exists(excel_path):
            print(f"Reading student list from {excel_path}...")
            try:
                # Bypass Windows Excel file locks by copying via PowerShell
                import subprocess
                subprocess.run(
                    ["powershell", "-Command", f"Copy-Item -Path '{excel_path}' -Destination '{temp_excel_path}' -Force"],
                    check=True,
                    capture_output=True
                )
                df = pd.read_excel(temp_excel_path)
                # Remove temp file immediately
                if os.path.exists(temp_excel_path):
                    os.remove(temp_excel_path)
            except Exception as e:
                print(f"Error copying/reading Excel: {e}")
                if os.path.exists(temp_excel_path):
                    try:
                        os.remove(temp_excel_path)
                    except:
                        pass
                return
                
            # Find column indexes
            headers = [str(col).strip().lower() for col in df.columns]
            name_idx = -1
            reg_idx = -1
            username_idx = -1
            
            for idx, h in enumerate(headers):
                if 'leetcode' in h or 'username' in h:
                    username_idx = idx
                elif 'register' in h or 'reg' in h:
                    reg_idx = idx
                elif 'name' in h:
                    name_idx = idx
                    
            if name_idx == -1 or reg_idx == -1 or username_idx == -1:
                print("Error: Excel must contain 'Name', 'Register Number', and 'LeetCode Username' columns.")
                return
                
            added_count = 0
            for index, row in df.iterrows():
                name = str(row.iloc[name_idx]).strip()
                reg_no = str(row.iloc[reg_idx]).strip()
                username = str(row.iloc[username_idx]).strip()
                
                # Validation
                if not name or not reg_no or not username or name == 'nan' or reg_no == 'nan' or username == 'nan':
                    continue
                    
                if reg_no.endswith('.0'):
                    reg_no = reg_no[:-2]
                    
                # Check for duplicates before adding
                existing = Student.query.filter(
                    (Student.register_number == reg_no) | 
                    (Student.leetcode_username == username)
                ).first()
                
                if existing:
                    print(f"Skipping duplicate: {name} ({reg_no} / {username})")
                    continue
                    
                student = Student(
                    name=name,
                    register_number=reg_no,
                    leetcode_username=username,
                    is_active=True
                )
                db.session.add(student)
                added_count += 1
                
            db.session.commit()
            print(f"Database seeded with {added_count} classmates successfully.")
        else:
            print("Template Excel file not found. Place students.xlsx in uploads/ directory.")

if __name__ == '__main__':
    seed_classmates()
