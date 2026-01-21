/**
 * 智能车间开发与应用平台 - 工具函数库
 * @description 包含登录验证、状态管理、应用配置等核心功能
 * @author IntelliPlant Dev Team
 * @version 1.0.0
 */

/**
 * 预设测试账号配置
 * @type {Array<{studentId: string, password: string, vmNumber: string, edgeServerUrl: string, difyUrl: string}>
 */
const ACCOUNTS = [
    { studentId: '2026001', password: '123456', vmNumber: '1', edgeServerUrl: 'https://vd01.zime.edu.cn/edgeserver#/login', difyUrl: 'https://vd01.zime.edu.cn/dify/' },
    { studentId: '2026002', password: '123456', vmNumber: '2', edgeServerUrl: 'https://vd02.zime.edu.cn/edgeserver#/login', difyUrl: 'https://vd02.zime.edu.cn/dify/' },
    { studentId: '2026003', password: '123456', vmNumber: '3', edgeServerUrl: 'https://vd03.zime.edu.cn/edgeserver#/login', difyUrl: 'https://vd03.zime.edu.cn/dify/' },
    { studentId: '2026004', password: '123456', vmNumber: '4', edgeServerUrl: 'https://vd04.zime.edu.cn/edgeserver#/login', difyUrl: 'https://vd04.zime.edu.cn/dify/' },
    { studentId: '2026005', password: '123456', vmNumber: '5', edgeServerUrl: 'https://vd05.zime.edu.cn/edgeserver#/login', difyUrl: 'https://vd05.zime.edu.cn/dify/' },
    { studentId: '2026006', password: '123456', vmNumber: '6', edgeServerUrl: 'http://10.40.6.165/edgeserver#/login', difyUrl: 'http://10.40.6.165/dify/' }
];

/**
 * 登录状态配置
 * @constant {number} LOGIN_EXPIRE_DAYS - 登录状态有效期（天）
 * @constant {number} LOGIN_EXPIRE_MS - 登录状态有效期（毫秒）
 * @constant {string} STORAGE_KEY - 本地存储键名
 */
const LOGIN_EXPIRE_DAYS = 30;
const LOGIN_EXPIRE_MS = LOGIN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'workshop_login_state';

/**
 * 验证账号密码
 * @param {string} studentId - 学号
 * @param {string} password - 密码
 * @returns {object|null} 验证成功返回用户信息，失败返回null
 */
function validateCredentials(studentId, password) {
    const account = ACCOUNTS.find(
        acc => acc.studentId === studentId && acc.password === password
    );
    return account || null;
}

/**
 * 保存登录状态到本地存储
 * @param {object} userInfo - 用户信息对象
 */
function saveLoginState(userInfo) {
    const loginState = {
        studentId: userInfo.studentId,
        vmNumber: userInfo.vmNumber,
        edgeServerUrl: userInfo.edgeServerUrl,
        difyUrl: userInfo.difyUrl,
        expireTime: Date.now() + LOGIN_EXPIRE_MS
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loginState));
}

/**
 * 获取当前登录状态
 * @returns {object|null} 有效状态返回用户信息，无效返回null
 */
function getLoginState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const loginState = JSON.parse(stored);
        const now = Date.now();

        // 检查登录状态是否过期
        if (loginState.expireTime <= now) {
            clearLoginState();
            return null;
        }

        return {
            studentId: loginState.studentId,
            vmNumber: loginState.vmNumber,
            edgeServerUrl: loginState.edgeServerUrl,
            difyUrl: loginState.difyUrl
        };
    } catch (e) {
        console.error('读取登录状态失败:', e);
        return null;
    }
}

/**
 * 清除登录状态
 */
function clearLoginState() {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
function isLoggedIn() {
    return getLoginState() !== null;
}

/**
 * 应用模块配置
 * @type {Array<{name: string, type: string, target: string, icon: string, accountTemplate?: string}>
 */
const APP_MODULES = [
    {
        name: 'IoT 平台',
        type: '外部链接',
        target: 'https://vlab.zime.edu.cn/platform/',
        icon: '🌐'
    },
    {
        name: 'IMS 平台',
        type: '外部链接',
        target: 'https://vlab.zime.edu.cn/platform/',
        icon: '🏭'
    },
    {
        name: '博图软件',
        type: '本地软件调用',
        target: 'tportal://local/launch',
        icon: '🔧'
    },
    {
        name: 'VC 软件',
        type: '本地软件调用',
        target: 'vc://local/launch',
        icon: '🎮'
    },
    {
        name: '边缘服务器',
        type: '关联服务访问',
        target: 'dynamic_edge_server',
        icon: '⚡',
        accountTemplate: 'admin 000000'
    },
    {
        name: '数字化工厂',
        type: '关联服务访问',
        target: 'http://linux-server:8080/digital-factory',
        icon: '🏗️'
    },
    {
        name: 'Dify',
        type: '关联服务访问',
        target: 'dynamic_dify',
        icon: '🤖',
        accountTemplate: 'Zncj{vmNumber}@edu.cn Zncj{vmNumber}@2024!'
    },
    {
        name: '智能教学 AI',
        type: '预留链接',
        target: 'https://chat.cyberedu.tech/',
        icon: '🧠'
    }
];

/**
 * 处理应用跳转
 * @param {object} app - 应用模块配置对象
 */
function handleAppNavigation(app) {
    if (app.target === '#') {
        alert('该功能暂未开放，敬请期待！');
        return;
    }

    try {
        // 获取当前登录状态
        const loginState = getLoginState();
        
        // 处理动态链接（边缘服务器和Dify）
        let targetUrl = app.target;
        if (app.target === 'dynamic_edge_server' && loginState) {
            targetUrl = loginState.edgeServerUrl;
        } else if (app.target === 'dynamic_dify' && loginState) {
            targetUrl = loginState.difyUrl;
        }

        if (app.type === '本地软件调用') {
            // 博图软件特殊处理
            if (app.name === '博图软件') {
                launchTiaPortal();
            } else if (app.name === 'VC 软件') {
                launchVisualComponents();
            } else {
                // 其他本地软件调用尝试
                window.location.href = targetUrl;
                setTimeout(() => {
                    alert('跳转失败，请检查软件是否已安装或配置是否正确');
                }, 2000);
            }
        } else {
            // 外部链接和关联服务在新窗口打开
            window.open(targetUrl, '_blank');
        }
    } catch (e) {
        alert('跳转失败，请检查配置');
    }
}

/**
 * 启动博途V16
 * @description 通过自定义协议启动博途软件，并最小化浏览器窗口
 */
function launchTiaPortal() {
    try {
        // 调用tia自定义协议启动博途
        const link = document.createElement('a');
        link.href = 'tia://open';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 浏览器窗口最小化/隐藏
        if (window.resizeTo) window.resizeTo(1, 1);
        if (window.moveTo) window.moveTo(screen.width, screen.height);
        if (window.blur) window.blur();

    } catch (error) {
        console.error('博途启动失败：', error);
        alert('博途启动失败！请检查注册表配置');
    }
}

/**
 * 启动Visual Components 4.9
 * @description 通过自定义协议启动VC软件，并最小化浏览器窗口
 */
function launchVisualComponents() {
    try {
        // 调用vc自定义协议启动Visual Components
        const link = document.createElement('a');
        link.href = 'vc://open';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 浏览器窗口最小化/隐藏
        if (window.resizeTo) window.resizeTo(1, 1);
        if (window.moveTo) window.moveTo(screen.width, screen.height);
        if (window.blur) window.blur();

    } catch (error) {
        console.error('VC启动失败：', error);
        alert('Visual Components启动失败！请检查注册表配置');
    }
}