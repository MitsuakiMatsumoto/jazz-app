document.addEventListener('DOMContentLoaded', () => {
    // 画面要素の取得
    const screens = {
        commonPasswordScreen: document.getElementById('common-password-screen'),
        selectionScreen: document.getElementById('selection-screen'),
        loginScreen: document.getElementById('login-screen'),
        signupScreen: document.getElementById('signup-screen'),
        dashboardScreen: document.getElementById('dashboard-screen'),
        studyOrderScreen: document.getElementById('study-order-screen'),
        scalesScreen: document.getElementById('scales-screen'),
        chordsScreen: document.getElementById('chords-screen'),
        settingsScreen: document.getElementById('settings-screen'),
        scaleListScreen: document.getElementById('scale-list-screen'),
        scalePracticeScreen: document.getElementById('scale-practice-screen'),
        chordListScreen: document.getElementById('chord-list-screen'),
        chordPracticeScreen: document.getElementById('chord-practice-screen'),
        major7ChordScreen: document.getElementById('major7-chord-screen'),
        minor7ChordScreen: document.getElementById('minor7-chord-screen'),
        seventhChordScreen: document.getElementById('7th-chord-screen')
    };

    // フォームとボタンの取得
    const commonPasswordForm = document.getElementById('common-password-form');
    const commonPasswordInput = document.getElementById('common-password');
    const loginSelectButton = document.querySelector('.login-select');
    const signupSelectButton = document.querySelector('.signup-select');
    const backButtons = document.querySelectorAll('.back-link a');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupPasswordConfirmInput = document.getElementById('signup-password-confirm');
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const mainMenu = document.getElementById('main-menu');
    const menuLinks = document.querySelectorAll('.menu-list li a');
    const mainScreenButtons = document.querySelectorAll('#dashboard-screen .menu-item-button');
    const scalesScreenButtons = document.querySelectorAll('#scales-screen .menu-item-button');
    const chordsScreenButtons = document.querySelectorAll('#chords-screen .menu-item-button');
    const chordListScreenButtons = document.querySelectorAll('#chord-list-screen .menu-item-button');
    const body = document.body;

    // 画面切り替え関数
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        mainMenu.classList.add('hidden'); // メニューを閉じる
        updateActiveMenu(screenId); // アクティブなメニューをハイライト
        
        // メニューの表示/非表示を切り替え
        if (screenId === 'common-password-screen' || screenId === 'selection-screen' || screenId === 'login-screen' || screenId === 'signup-screen') {
            body.classList.add('no-menu');
        } else {
            body.classList.remove('no-menu');
        }
    }

    // アクティブなメニューをハイライトする関数
    function updateActiveMenu(screenId) {
        let activeMenuItemId;
        // 各コンテンツ画面から親のメニュー項目を特定
        if (screenId.includes('scale')) {
            activeMenuItemId = 'menu-scales';
        } else if (screenId.includes('chord')) {
            activeMenuItemId = 'menu-chords';
        } else if (screenId.includes('study-order')) {
            activeMenuItemId = 'menu-study-order';
        } else if (screenId.includes('settings')) {
            activeMenuItemId = 'menu-settings';
        } else if (screenId.includes('dashboard')) {
            activeMenuItemId = 'menu-dashboard';
        } else {
            activeMenuItemId = '';
        }

        menuLinks.forEach(link => {
            if (link.parentElement.id === activeMenuItemId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ピアノ鍵盤の音名データ
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // ピアノ鍵盤を描画する関数
    function drawPianoKeyboard(containerElement, rootNote, interval) {
        containerElement.innerHTML = '';
        
        const rootNoteIndex = noteNames.indexOf(rootNote);
        const chordNotes = interval.map(i => (rootNoteIndex + i) % 12);
        
        // Cの鍵盤から左右に3半音ずつ広げた表示範囲を定義
        const totalKeys = 18; // Cから1オクターブと3半音上、およびCから3半音下
        const cNoteIndex = noteNames.indexOf('C');
        const startNoteIndex = (cNoteIndex - 3 + 12) % 12;

        const keyboardContent = document.createElement('div');
        keyboardContent.className = 'piano-keyboard-content';
        
        // 水平スライドの計算
        const slideOffset = (rootNoteIndex - cNoteIndex) * 10; // 1半音あたり10pxのずれ
        keyboardContent.style.left = `${-slideOffset}px`;

        for (let i = 0; i < totalKeys; i++) {
            const currentNoteIndex = (startNoteIndex + i) % 12;
            const isBlackKey = [1, 3, 6, 8, 10].includes(currentNoteIndex);

            const key = document.createElement('div');
            key.className = isBlackKey ? 'black-key' : 'white-key';
            
            // 赤い丸をつける
            if (chordNotes.includes(currentNoteIndex)) {
                const noteMark = document.createElement('div');
                noteMark.className = 'note-mark';
                key.appendChild(noteMark);
            }
            
            // 黒鍵の水平位置を調整
            if (isBlackKey) {
                if (currentNoteIndex === 1) key.style.left = `${30 * Math.floor(i / 12) + 20}px`;
                if (currentNoteIndex === 3) key.style.left = `${30 * Math.floor(i / 12) + 50}px`;
                if (currentNoteIndex === 6) key.style.left = `${30 * Math.floor(i / 12) + 110}px`;
                if (currentNoteIndex === 8) key.style.left = `${30 * Math.floor(i / 12) + 140}px`;
                if (currentNoteIndex === 10) key.style.left = `${30 * Math.floor(i / 12) + 170}px`;
            }
            
            keyboardContent.appendChild(key);
        }
        
        containerElement.appendChild(keyboardContent);
    }
    
    // 自動ログアウトのタイマー設定 (5分)
    let logoutTimer;
    const inactivityTimeout = 5 * 60 * 1000; 

    function resetLogoutTimer() {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            alert('5分間操作がなかったため、ログアウトしました。');
            showScreen('common-password-screen');
        }, inactivityTimeout);
    }
    
    // 全てのユーザー操作を監視してタイマーをリセット
    document.addEventListener('mousemove', resetLogoutTimer);
    document.addEventListener('keypress', resetLogoutTimer);
    document.addEventListener('click', resetLogoutTimer);


    // 共通パスワードフォームの送信処理
    commonPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const commonPassword = commonPasswordInput.value.trim();
        const correctPassword = 'sso2025';

        if (commonPassword === correctPassword) {
            alert('認証に成功しました！');
            showScreen('selection-screen');
        } else {
            alert('パスワードが間違っています。');
        }
    });

    // 選択画面でのボタンクリック処理
    loginSelectButton.addEventListener('click', () => {
        showScreen('login-screen');
    });

    signupSelectButton.addEventListener('click', () => {
        showScreen('signup-screen');
    });
    
    // 戻るボタンとログアウトボタンのクリック処理
    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreenId = button.dataset.screen;
            if (targetScreenId === 'logout') {
                 showScreen('common-password-screen');
                 alert('ログアウトしました。');
            } else {
                showScreen(targetScreenId);
            }
        });
    });

    // ログインフォームの送信処理
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(loginForm);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            alert(result);
            
            if (result === 'ログイン成功！') {
                showScreen('dashboard-screen');
                resetLogoutTimer();
            }
        } catch (error) {
            alert('通信エラーが発生しました。もう一度お試しください。');
        }
    });

    // 新規登録フォームの送信処理
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = signupPasswordInput.value;
        const passwordConfirm = signupPasswordConfirmInput.value;

        if (password !== passwordConfirm) {
            alert('パスワードが一致しません。もう一度入力してください。');
            return;
        }
        
        const formData = new FormData(signupForm);

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            alert(result);
            
            if (result === '新規登録が完了しました！') {
                showScreen('login-screen');
            }

        } catch (error) {
            alert('通信エラーが発生しました。もう一度お試しください。');
        }
    });

    // メニューの開閉
    menuToggleButton.addEventListener('click', () => {
        mainMenu.classList.toggle('hidden');
    });

    // メニューアイテムのクリック処理
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const screenId = e.target.dataset.screen;
            if (screenId === 'logout') {
                 alert('ログアウトしました。');
                 showScreen('common-password-screen');
            } else {
                showScreen(screenId);
            }
        });
    });

    // 勉強メニュー画面のボタンクリック処理
    mainScreenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreenId = e.target.dataset.screen;
            showScreen(targetScreenId);
        });
    });
    
    // スケール画面のボタンクリック処理
    scalesScreenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreenId = e.target.dataset.screen;
            showScreen(targetScreenId);
        });
    });

    // コード画面のボタンクリック処理
    chordsScreenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreenId = e.target.dataset.screen;
            showScreen(targetScreenId);
        });
    });

    // コード一覧画面のボタンクリック処理
    chordListScreenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreenId = e.target.dataset.screen;
            showScreen(targetScreenId);
            
            // メジャーセブンス画面に遷移したときに鍵盤を描画
            if (targetScreenId === 'major7-chord-screen') {
                const rootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                const major7Interval = [0, 4, 7, 11]; // ルート, 長3度, 完全5度, 長7度
                
                const container = document.getElementById('major7-chords-container');
                container.innerHTML = '';
                
                rootNotes.forEach(note => {
                    const keyboardWrapper = document.createElement('div');
                    keyboardWrapper.className = 'piano-keyboard-wrapper';
                    keyboardWrapper.innerHTML = `<h3>${note}メジャーセブンス</h3>`;
                    
                    drawPianoKeyboard(keyboardWrapper, note, major7Interval);
                    container.appendChild(keyboardWrapper);
                });
            }
        });
    });
    
    // 初期画面設定
    showScreen('common-password-screen');
});