from app import app, db
from models import Submission
from scheduler import get_problem_difficulty

def fix_difficulties():
    with app.app_context():
        print("Fetching all submissions from database...")
        submissions = Submission.query.all()
        print(f"Found {len(submissions)} submissions. Verifying difficulties...")
        
        updated_count = 0
        for idx, sub in enumerate(submissions):
            correct_diff = get_problem_difficulty(sub.title_slug)
            if sub.difficulty != correct_diff:
                print(f"[{idx+1}/{len(submissions)}] Updating '{sub.title}': {sub.difficulty} -> {correct_diff}")
                sub.difficulty = correct_diff
                updated_count += 1
                
        if updated_count > 0:
            db.session.commit()
            print(f"Done! Successfully updated {updated_count} submissions.")
        else:
            print("All submissions are already using correct LeetCode difficulties.")

if __name__ == '__main__':
    fix_difficulties()
