// ========== 全局基础配置 & 常量 ==========
const PAUSE_CONFIG = { period:700, mark:400, newline:150 };
let pauseTimer = null;
let pendingText = '';
let lastWordText = '';
let prevInputValue = '';
let currentEntryIndex = 0;
let entryCharsList = [];
let finishedWordSet = new Set();
let isFullTextMode = false;
let isBilingualMode = false;
let comboCount = 0;
let wrongContinuous = 0;
let stickerUnlock = [false,false,false,false];
let isLastLineEnter = false;
let waitFinalEnter = false;

// 文本&打字核心变量
let targetFullText='', targetChars=[], currentPos=0;
let startTime=null, timerId=null, totalInput=0, correctCnt=0, typingRunning=false;

// 语音状态
let speechState={
    sentences:[],
    idx:0,
    running:false,
    rate:0.75,
    volume: parseFloat(localStorage.getItem('speechVolume')) || 1.0
};

// 字号配置（持久化）
let fontScale = parseFloat(localStorage.getItem('fontScale')) || 1.0;

// ========== 缓存所有DOM元素 ==========
const htmlRoot = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const wordSpeakToggleBtn = document.getElementById('wordSpeakToggle');
const sourceTextEl=document.getElementById('sourceText');
const charCountEl=document.getElementById('charCount');
const fileInputEl=document.getElementById('fileInput');
const readAllBtnEl=document.getElementById('readAllBtn');
const speechRateEl=document.getElementById('speechRate');
const speechVolumeEl=document.getElementById('speechVolume');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeText = document.getElementById('fontSizeText');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const helpCloseBtn = document.getElementById('helpCloseBtn');
const clearBtnEl=document.getElementById('clearBtn');
const startBtnEl=document.getElementById('startBtn');
const resetBtnEl=document.getElementById('resetBtn');
const inputAreaEl=document.getElementById('inputArea');
const displayAreaEl=document.getElementById('displayArea');
const bilingualAreaEl=document.getElementById('bilingualArea');
const paragraphContainerEl=document.getElementById('paragraphContainer');
const toggleTranslationBtnEl=document.getElementById('toggleTranslationBtn');
const areaTitleEl=document.getElementById('areaTitle');
const speedEl=document.getElementById('speed');
const accuracyEl=document.getElementById('accuracy');
const timeUsedEl=document.getElementById('timeUsed');
const progressEl=document.getElementById('progress');
const speedBar=document.getElementById('speedBar');
const accBar=document.getElementById('accBar');
const progBar=document.getElementById('progBar');
const modeModal=document.getElementById('modeModal');
const modalOkBtn=document.getElementById('modalOkBtn');
const modalCancelBtn=document.getElementById('modalCancelBtn');
const quickLinkBtns=document.querySelectorAll('.quick-link');

// ========== 本地存储初始化：主题 & 单词朗读开关 ==========
let currentTheme = localStorage.getItem('pageTheme') || 'dark';
htmlRoot.setAttribute('data-theme', currentTheme);

let wordSpeakEnable = localStorage.getItem('wordSpeakEnable') ?? 'true';

// ========== 工具方法 ==========
function updateThemeButtonText() {
    if(currentTheme === 'light') {
        themeToggleBtn.textContent = '切换暗色模式';
    } else {
        themeToggleBtn.textContent = '切换日间模式';
    }
}
function updateWordSpeakBtnText() {
    if(wordSpeakEnable === 'true') {
        wordSpeakToggleBtn.textContent = '单词朗读：已开启';
        wordSpeakToggleBtn.classList.add('btn-success');
    } else {
        wordSpeakToggleBtn.textContent = '单词朗读：已关闭';
        wordSpeakToggleBtn.classList.remove('btn-success');
    }
}