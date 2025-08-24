from flask import Flask, request, render_template, redirect, url_for
import sqlite3

app = Flask(__name__)

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
    conn.commit()
    conn.close()

# ホームページの表示
@app.route('/')
def home():
    return render_template('index.html')

# 新規登録機能の追加
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

# ログイン機能の追加
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['login-username']
        password = request.form['login-password']
        
        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            (username, password)
        ).fetchone()
        conn.close()

        if user:
            return 'ログイン成功！'
        else:
            return 'ユーザー名またはパスワードが間違っています。'

# アプリ起動時にデータベースを初期化
if __name__ == '__main__':
    init_db()
    app.run(debug=True)