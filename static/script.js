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

    // ピアノ鍵盤を描画する関数
    function drawPianoKeyboard(containerElement, rootNote, interval) {
        containerElement.innerHTML = '';

        // ピアノの音名データとインデックス
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        // コードを構成する音の絶対インデックスを計算
        const rootNoteIndex = noteNames.indexOf(rootNote);
        const chordNotes = interval.map(i => rootNoteIndex + i);

        const keyboardContent = document.createElement('div');
        keyboardContent.className = 'piano-keyboard-content';

        // 白鍵を描画 (2オクターブ分)
        for (let octave = 0; octave < 2; octave++) {
            whiteKeyNames.forEach(noteName => {
                const key = document.createElement('div');
                key.className = 'white-key';

                // 白鍵の絶対的な音程インデックスを計算
                let absoluteNoteIndex = noteNames.indexOf(noteName) + octave * 12;

                // 1オクターブ内に限定
                if (absoluteNoteIndex >= rootNoteIndex && absoluteNoteIndex <= rootNoteIndex + 12) {
                    // E#とB#の変換ルールを適用
                    let adjustedNoteIndex = absoluteNoteIndex;
                    if (rootNote === 'C#' && noteName === 'F') {
                        // C#メジャーセブンスのE#はFに相当
                        adjustedNoteIndex = noteNames.indexOf('F') + octave * 12;
                    } else if (rootNote === 'C#' && noteName === 'C' && octave === 1) {
                        // C#メジャーセブンスのB#は1オクターブ上のCに相当
                        adjustedNoteIndex = noteNames.indexOf('C') + octave * 12;
                    }

                    // コードの構成音に含まれるかチェックし、赤い丸を描画
                    if (chordNotes.includes(adjustedNoteIndex)) {
                        const noteMark = document.createElement('div');
                        noteMark.className = 'note-mark white-key-mark';
                        key.appendChild(noteMark);
                    }
                }
                keyboardContent.appendChild(key);
            });
        }

        // 黒鍵を描画 (2オクターブ分)
        const blackKeyPositions = [20, 50, 110, 140, 170];
        const blackKeyNoteIndices = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#

        for (let octave = 0; octave < 2; octave++) {
            blackKeyNoteIndices.forEach((noteIndex, i) => {
                const key = document.createElement('div');
                key.className = 'black-key';
                key.style.left = `${blackKeyPositions[i] + octave * 210}px`;

                const absoluteNoteIndex = noteIndex + octave * 12;

                // 1オクターブ内に限定
                if (absoluteNoteIndex >= rootNoteIndex && absoluteNoteIndex <= rootNoteIndex + 12) {
                    // コードの構成音に含まれるかチェックし、赤い丸を描画
                    if (chordNotes.includes(absoluteNoteIndex)) {
                        const noteMark = document.createElement('div');
                        noteMark.className = 'note-mark black-key-mark';
                        key.appendChild(noteMark);
                    }
                }
                keyboardContent.appendChild(key);
            });
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

            const rootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const flatNotes = {
                'C#': 'D♭',
                'D#': 'E♭',
                'F#': 'G♭',
                'G#': 'A♭',
                'A#': 'B♭'
            };

            // メジャーセブンス画面に遷移したときに鍵盤を描画
            if (targetScreenId === 'major7-chord-screen') {
                const major7Interval = [0, 4, 7, 11]; // ルート, 長3度, 完全5度, 長7度

                const container = document.getElementById('major7-chords-container');
                container.innerHTML = '';

                rootNotes.forEach(note => {
                    const keyboardWrapper = document.createElement('div');
                    keyboardWrapper.className = 'piano-keyboard-wrapper';

                    let displayName = note;
                    if (flatNotes[note]) {
                        displayName = `${note}△７ (${flatNotes[note]}△７)`;
                    } else {
                        displayName = `${note}△７`;
                    }

                    keyboardWrapper.innerHTML = `<h3>${displayName}</h3>`;

                    const keyboardContainer = document.createElement('div');
                    keyboardContainer.className = 'piano-keyboard-content';
                    keyboardWrapper.appendChild(keyboardContainer);

                    drawPianoKeyboard(keyboardContainer, note, major7Interval);
                    container.appendChild(keyboardWrapper);
                });
            }

            // マイナーセブンス画面に遷移したときに鍵盤を描画
            if (targetScreenId === 'minor7-chord-screen') {
                const minor7Interval = [0, 3, 7, 10]; // ルート, 短3度, 完全5度, 短7度

                const container = document.getElementById('minor7-chords-container');
                container.innerHTML = '';

                rootNotes.forEach(note => {
                    const keyboardWrapper = document.createElement('div');
                    keyboardWrapper.className = 'piano-keyboard-wrapper';

                    let displayName = note;
                    if (flatNotes[note]) {
                        displayName = `${note}m７ (${flatNotes[note]}m７)`;
                    } else {
                        displayName = `${note}m７`;
                    }

                    keyboardWrapper.innerHTML = `<h3>${displayName}</h3>`;

                    const keyboardContainer = document.createElement('div');
                    keyboardContainer.className = 'piano-keyboard-content';
                    keyboardWrapper.appendChild(keyboardContainer);

                    drawPianoKeyboard(keyboardContainer, note, minor7Interval);
                    container.appendChild(keyboardWrapper);
                });
            }

            // セブンス画面に遷移したときに鍵盤を描画
            if (targetScreenId === '7th-chord-screen') {
                const seventhInterval = [0, 4, 7, 10]; // ルート, 長3度, 完全5度, 短7度

                const container = document.getElementById('7th-chords-container');
                container.innerHTML = '';

                rootNotes.forEach(note => {
                    const keyboardWrapper = document.createElement('div');
                    keyboardWrapper.className = 'piano-keyboard-wrapper';

                    let displayName = note;
                    if (flatNotes[note]) {
                        displayName = `${note}７ (${flatNotes[note]}７)`;
                    } else {
                        displayName = `${note}７`;
                    }

                    keyboardWrapper.innerHTML = `<h3>${displayName}</h3>`;

                    const keyboardContainer = document.createElement('div');
                    keyboardContainer.className = 'piano-keyboard-content';
                    keyboardWrapper.appendChild(keyboardContainer);

                    drawPianoKeyboard(keyboardContainer, note, seventhInterval);
                    container.appendChild(keyboardWrapper);
                });
            }
        });
    });

    // 問題データを定義
    const allChords = [
        { name: "△7", interval: [0, 4, 7, 11] },
        { name: "m7", interval: [0, 3, 7, 10] },
        { name: "7", interval: [0, 4, 7, 10] }
    ];

    const allRootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const flatNoteAliases = {
        'C#': 'D♭',
        'D#': 'E♭',
        'F#': 'G♭',
        'G#': 'A♭',
        'A#': 'B♭',
        'F': 'E#',
        'C': 'B#'
    };

    // 新しい異名同音のマップ（双方向）
    const enharmonicMap = {
        'C#': 'D♭', 'D♭': 'C#',
        'D#': 'E♭', 'E♭': 'D#',
        'F#': 'G♭', 'G♭': 'F#',
        'G#': 'A♭', 'A♭': 'G#',
        'A#': 'B♭', 'B♭': 'A#',
        'B': 'C♭', 'C♭': 'B',
        'C': 'B#', 'B#': 'C',
        'E': 'F♭', 'F♭': 'E',
        'F': 'E#', 'E#': 'F'
    };

    let currentQuestion = {};
    let score = { correct: 0, total: 0 };

    // ユーザーの選択を保持する変数
    let selectedRoot = '';
    let selectedAccidental = '';
    let selectedChordType = '';

    // 新しい問題のUIを生成する関数
    function generateQuizUI() {
        const quizArea = document.getElementById('quiz-area');

        // 既存のフォームがあれば削除
        const existingQuizForm = document.getElementById('quiz-form');
        if (existingQuizForm) {
            existingQuizForm.remove();
        }

        // 新しいUIを構築
        const quizForm = document.createElement('div');
        quizForm.id = 'quiz-form';

        // ルート音の選択肢
        const rootGroup = document.createElement('div');
        rootGroup.className = 'selection-group';
        rootGroup.innerHTML = '<h3>ルート</h3><div class="quiz-button-group"></div>';
        naturalNotes.forEach(note => {
            rootGroup.querySelector('.quiz-button-group').innerHTML += `
                <input type="radio" id="root-${note}" name="root-selection" value="${note}" class="quiz-radio">
                <label for="root-${note}">${note}</label>
            `;
        });

        // 変化記号の選択肢
        const accidentalGroup = document.createElement('div');
        accidentalGroup.className = 'selection-group';
        accidentalGroup.innerHTML = '<h3>変化記号</h3><div class="quiz-button-group"></div>';
        ['#', '♭'].forEach(symbol => {
            accidentalGroup.querySelector('.quiz-button-group').innerHTML += `
                <input type="radio" id="accidental-${symbol}" name="accidental-selection" value="${symbol}" class="quiz-radio">
                <label for="accidental-${symbol}">${symbol}</label>
            `;
        });
        accidentalGroup.querySelector('.quiz-button-group').innerHTML += `
                <input type="radio" id="accidental-none" name="accidental-selection" value="" class="quiz-radio">
                <label for="accidental-none">なし</label>
        `;

        // コードタイプの選択肢
        const chordTypeGroup = document.createElement('div');
        chordTypeGroup.className = 'selection-group';
        chordTypeGroup.innerHTML = '<h3>コードタイプ</h3><div class="quiz-button-group"></div>';
        allChords.forEach(chord => {
            chordTypeGroup.querySelector('.quiz-button-group').innerHTML += `
                <input type="radio" id="chord-type-${chord.name}" name="chord-type-selection" value="${chord.name}" class="quiz-radio">
                <label for="chord-type-${chord.name}">${chord.name}</label>
            `;
        });

        quizForm.appendChild(rootGroup);
        quizForm.appendChild(accidentalGroup);
        quizForm.appendChild(chordTypeGroup);

        const submitButton = document.getElementById('submit-answer-button');
        const quizAreaInner = document.getElementById('quiz-area');
        quizAreaInner.insertBefore(quizForm, submitButton);

        // ラジオボタンのイベントリスナー
        document.querySelectorAll('input[name="root-selection"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                selectedRoot = e.target.value;
                checkSelectionComplete();
            });
        });
        document.querySelectorAll('input[name="accidental-selection"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                selectedAccidental = e.target.value;
                checkSelectionComplete();
            });
        });
        document.querySelectorAll('input[name="chord-type-selection"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                selectedChordType = e.target.value;
                checkSelectionComplete();
            });
        });
    }

    // 新しい問題を出題する関数
    function generateNewQuestion() {
        // ユーザー選択をリセット
        selectedRoot = '';
        selectedAccidental = '';
        selectedChordType = '';

        // UIを再生成
        generateQuizUI();

        // UIをリセット
        document.getElementById('result-message').textContent = '';
        document.getElementById('next-question-button').style.display = 'none';
        document.getElementById('submit-answer-button').disabled = true;

        // すべてのラジオボタンの選択を解除
        document.querySelectorAll('.quiz-radio').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.quiz-button-group label').forEach(label => {
            label.classList.remove('selected'); // スタイルもリセット
        });


        const randomRootIndex = Math.floor(Math.random() * allRootNotes.length);
        const randomRoot = allRootNotes[randomRootIndex];
        const randomChordType = allChords[Math.floor(Math.random() * allChords.length)];

        currentQuestion = {
            root: randomRoot,
            name: randomChordType.name,
            interval: randomChordType.interval
        };

        // 鍵盤を描画
        const pianoContainer = document.getElementById('piano-quiz-container');
        drawPianoKeyboard(pianoContainer, currentQuestion.root, currentQuestion.interval);

        updateScoreDisplay();
    }

    // 解答を判定する関数
    function checkAnswer() {
        document.getElementById('submit-answer-button').disabled = true;

        let isCorrect = false;

        // 正解のルート音と異名同音のリストを作成
        const correctRoots = [currentQuestion.root];
        if (enharmonicMap[currentQuestion.root]) {
            correctRoots.push(enharmonicMap[currentQuestion.root]);
        }

        // ユーザーの回答を結合
        const userSelectedRootCombined = selectedRoot + selectedAccidental;

        // ルート音の正誤判定
        const isRootCorrect = correctRoots.includes(userSelectedRootCombined);

        // コードタイプの正誤判定
        const isChordTypeCorrect = selectedChordType === currentQuestion.name;

        if (isRootCorrect && isChordTypeCorrect) {
            isCorrect = true;
        }

        score.total++;
        if (isCorrect) {
            score.correct++;
            document.getElementById('result-message').textContent = '正解です！🎉';
            document.getElementById('result-message').style.color = 'green';
        } else {
            const correctName = `${currentQuestion.root}${currentQuestion.name}`;
            const aliasName = enharmonicMap[currentQuestion.root] ? `${enharmonicMap[currentQuestion.root]}${currentQuestion.name}` : null;

            let message = `不正解です。正解は「${correctName}」でした。`;
            if (aliasName) {
                message += `（または「${aliasName}」）`;
            }
            document.getElementById('result-message').textContent = message;
            document.getElementById('result-message').style.color = 'red';
        }

        updateScoreDisplay();
        document.getElementById('next-question-button').style.display = 'block';
    }

    // 成績表示を更新する関数
    function updateScoreDisplay() {
        document.getElementById('correct-count').textContent = score.correct;
        document.getElementById('total-count').textContent = score.total;
        const accuracy = score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);
        document.getElementById('accuracy-rate').textContent = accuracy;
    }

    // 選択が完了したかチェックする関数
    function checkSelectionComplete() {
        // ルート音とコードタイプが選択されているかを確認
        // 変化記号は「なし」も含むため、selectedAccidentalは必ず何か入る
        if (selectedRoot && selectedChordType) {
            document.getElementById('submit-answer-button').disabled = false;
        } else {
            document.getElementById('submit-answer-button').disabled = true;
        }
    }

    // 解答ボタンのクリックイベント
    document.getElementById('submit-answer-button').addEventListener('click', () => {
        checkAnswer();
    });

    // 次の問題へ進むボタンのイベントリスナー
    document.getElementById('next-question-button').addEventListener('click', () => {
        generateNewQuestion();
    });

    // コード練習画面が表示されたときに問題を生成
    const chordPracticeScreen = document.getElementById('chord-practice-screen');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && chordPracticeScreen.classList.contains('active')) {
                generateNewQuestion();
            }
        });
    });
    observer.observe(chordPracticeScreen, { attributes: true });

    // 初期画面設定
    showScreen('common-password-screen');
});