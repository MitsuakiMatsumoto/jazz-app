from flask import Flask, request, render_template, redirect, url_for, session, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here' # セッション管理のための秘密鍵を設定

# データベース接続関数
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# データベースを初期化する
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            instrument_key TEXT,
            instrument_name TEXT
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            question_root TEXT NOT NULL,
            question_chord_type TEXT NOT NULL,
            user_answer_root TEXT,
            user_answer_accidental TEXT,
            user_answer_chord_type TEXT,
            is_correct INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

# ホームページの表示
@app.route('/')
def home():
    return render_template('index.html')

# 新規登録機能
@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        username = request.form['signup-username']
        password = request.form['signup-password']
        instrument_key = request.form['instrument-key']
        instrument_name = request.form['instrument-name']

        conn = get_db_connection()
        try:
            conn.execute(
                'INSERT INTO users (username, password, instrument_key, instrument_name) VALUES (?, ?, ?, ?)',
                (username, password, instrument_key, instrument_name)
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            return 'ユーザー名がすでに存在します。'

        conn.close()
        return '新規登録が完了しました！'

# ログイン機能
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['login-username']
        password = request.form['login-password']
        
        conn = get_db_connection()
        user = conn.execute(
            'SELECT id FROM users WHERE username = ? AND password = ?',
            (username, password)
        ).fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            return 'ログイン成功！'
        else:
            return 'ユーザー名またはパスワードが間違っています。'

# ログアウト機能
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return 'ログアウトしました。'

# 解答を保存するAPI
@app.route('/save_answer', methods=['POST'])
def save_answer():
    if 'user_id' not in session:
        return jsonify({"error": "ログインしていません。"}), 401

    data = request.json
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO quiz_results (user_id, question_root, question_chord_type, user_answer_root, user_answer_accidental, user_answer_chord_type, is_correct) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            session['user_id'],
            data['question_root'],
            data['question_chord_type'],
            data['user_answer_root'],
            data['user_answer_accidental'],
            data['user_answer_chord_type'],
            1 if data['is_correct'] else 0
        )
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "解答が保存されました。"})

# ユーザーの成績を取得するAPI
@app.route('/get_user_stats')
def get_user_stats():
    if 'user_id' not in session:
        return jsonify({"correct_count": 0, "total_count": 0})

    conn = get_db_connection()
    stats = conn.execute("SELECT COUNT(*) as total_count, SUM(is_correct) as correct_count FROM quiz_results WHERE user_id = ?", (session['user_id'],)).fetchone()
    conn.close()
    
    total = stats['total_count'] if stats['total_count'] is not None else 0
    correct = stats['correct_count'] if stats['correct_count'] is not None else 0
    
    return jsonify({
        "correct_count": correct,
        "total_count": total
    })

# 間違えた問題を取得するAPI
@app.route('/get_wrong_questions')
def get_wrong_questions():
    if 'user_id' not in session:
        return jsonify([])

    conn = get_db_connection()
    wrong_questions = conn.execute("SELECT question_root, question_chord_type FROM quiz_results WHERE user_id = ? AND is_correct = 0", (session['user_id'],)).fetchall()
    conn.close()
    
    # 重複を排除して返す
    unique_wrong_questions = list(set([(q['question_root'], q['question_chord_type']) for q in wrong_questions]))
    
    return jsonify([{"root": q[0], "chord_type": q[1]} for q in unique_wrong_questions])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)