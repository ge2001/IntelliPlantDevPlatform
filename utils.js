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
        name: '数字教材',
        // type: '外部链接',
        target: 'https://etextbookpro.hep.com.cn/web/book/1307261328892624896',
        icon: '📚'
    },
    {
        name: '数字化工厂',
        // type: '关联服务访问',
        target: 'http://linux-server:8080/digital-factory',
        icon: '🏗️'
    },
    {
        name: '边缘服务器',
        // type: '关联服务访问',
        target: 'dynamic_edge_server',
        icon: '⚡'
        // accountTemplate: 'admin 000000'
    },
    {
        name: 'IoT 平台',
        // type: '外部链接',
        target: 'http://leapiot.hzzc-tech.cn/#/preview',
        icon: '🌐'
    },
    {
        name: 'IMS 平台',
        // type: '外部链接',
        target: 'http://leaplab.hzzc-tech.cn/platform/#/leapIMS',
        icon: '🏭'
    },
    {
        name: '智能制造大数据实训平台',
        // type: '外部链接',
        target: 'http://leaplab.hzzc-tech.cn/user/',
        icon: '📊'
    },
    {
        name: '数字化实训室',
        // type: '本地软件调用',
        target: '实训室',
        icon: '🔬'
    },
    {
        name: '人工智能应用平台',
        // type: '关联服务访问',
        target: 'dynamic_dify',
        icon: '🤖'
        // accountTemplate: 'Zncj{vmNumber}@edu.cn Zncj{vmNumber}@2024!'
    },
    {
        name: '小z教学助手',
        // type: '预留链接',
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
        // 数字化工厂特殊处理：显示弹窗
        if (app.name === '数字化工厂') {
            showDigitalFactoryModal();
            return;
        }

        // 数字化实训室特殊处理：显示弹窗选择软件
        if (app.name === '数字化实训室') {
            showTrainingRoomModal();
            return;
        }

        // 获取当前登录状态
        const loginState = getLoginState();
        
        // 处理动态链接（边缘服务器和Dify）
        let targetUrl = app.target;
        if (app.target === 'dynamic_edge_server' && loginState) {
            targetUrl = loginState.edgeServerUrl;
        } else if (app.target === 'dynamic_dify' && loginState) {
            targetUrl = loginState.difyUrl;
        }

        // 其他应用在新窗口打开
        window.open(targetUrl, '_blank');
    } catch (e) {
        alert('跳转失败，请检查配置');
    }
}

/**
 * 显示智能实训室弹窗
 */
function showTrainingRoomModal() {
    // 检查弹窗是否已存在
    if (document.getElementById('trainingRoomModal')) {
        return;
    }

    // 弹窗HTML
    const modalHTML = `
        <div id="trainingRoomModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; color: #333; font-weight: 600; margin: 0;">数字化实训室</h2>
                    <button onclick="closeTrainingRoomModal()" style="
                        background: none;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: #999;
                        padding: 0 8px;
                        line-height: 1;
                    ">&times;</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                    <div onclick="launchTiaPortal(); closeTrainingRoomModal();" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 32px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔧</div>
                        <div style="font-size: 18px; font-weight: 600; color: #333;">西门子PLC技术实训室</div>
                    </div>
                    <div onclick="launchVisualComponents(); closeTrainingRoomModal();" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 32px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">🎮</div>
                        <div style="font-size: 18px; font-weight: 600; color: #333;">制造仿真技术实训室</div>
                    </div>
                    <div onclick="window.open('https://www.720yun.com/vr/c5ejz7saka3', '_blank'); closeTrainingRoomModal();" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 32px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">🏭</div>
                        <div style="font-size: 18px; font-weight: 600; color: #333;">智能车间实训室</div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #trainingRoomModal > div > div > div:hover {
                background: #667eea;
                border-color: #667eea;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
        </style>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * 关闭智能实训室弹窗
 */
function closeTrainingRoomModal() {
    const modal = document.getElementById('trainingRoomModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * 显示数字化工厂弹窗
 */
function showDigitalFactoryModal() {
    // 检查弹窗是否已存在
    if (document.getElementById('digitalFactoryModal')) {
        return;
    }

    // 弹窗HTML
    const modalHTML = `
        <div id="digitalFactoryModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 900px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; color: #333; font-weight: 600; margin: 0;">数字化工厂</h2>
                    <button onclick="closeDigitalFactoryModal()" style="
                        background: none;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: #999;
                        padding: 0 8px;
                        line-height: 1;
                    ">&times;</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                    <div onclick="handleFactoryNavigation('智能线上仓储单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能线上仓储单元</div>
                    <div onclick="handleFactoryNavigation('成品生产线')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">成品生产线</div>
                    <div onclick="handleFactoryNavigation('智能检测单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能检测单元</div>
                    <div onclick="handleFactoryNavigation('MOMA单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">MOMA单元</div>
                    <div onclick="handleFactoryNavigation('智能加工单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能加工单元</div>
                    <div onclick="handleFactoryNavigation('智能装配单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能装配单元</div>
                    <div onclick="handleFactoryNavigation('智能包装单元')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能包装单元</div>
                    <div onclick="handleFactoryNavigation('智能车间')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能车间</div>
                    <div onclick="handleFactoryNavigation('智能车间规划')" style="
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 24px 16px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">智能车间规划</div>
                </div>
            </div>
        </div>
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #digitalFactoryModal > div > div > div:hover {
                background: #667eea;
                border-color: #667eea;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
        </style>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * 关闭数字化工厂弹窗
 */
function closeDigitalFactoryModal() {
    const modal = document.getElementById('digitalFactoryModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * 数字化工厂单元链接配置
 */
const FACTORY_UNITS = {
    '智能线上仓储单元': '/zhinengxianshangcanchudanyuan/#/',
    '成品生产线': '/chengpinshengchanxian/#/',
    '智能检测单元': '/zhinengjiancedanyuan/#/',
    'MOMA单元': '/momadanyuan/#/',
    '智能加工单元': '/zhinengjiagongdanyuan/#/',
    '智能装配单元': '/zhinengzhuangpeidanyuan/#/',
    '智能包装单元': '/zhinengbaozhuangdanyuan/#/',
    '智能车间': '/zhinengchejian/#/',
    '智能车间规划': '/zhinengchejianguihua/#/'
};

/**
 * 处理工厂导航
 * @param {string} unit - 单元名称
 */
function handleFactoryNavigation(unit) {
    closeDigitalFactoryModal();
    
    // 获取当前登录状态
    const loginState = getLoginState();
    if (!loginState) {
        alert('请先登录系统');
        return;
    }
    
    // 根据虚拟机编号获取域名
    const vmNumber = loginState.vmNumber;
    let baseUrl = '';
    
    if (vmNumber >= 1 && vmNumber <= 5) {
        baseUrl = `https://vd0${vmNumber}.zime.edu.cn`;
    } else if (vmNumber === '6') {
        // 6号虚拟机使用IP地址
        baseUrl = 'http://10.40.6.165';
    } else {
        alert('未知的虚拟机编号');
        return;
    }
    
    // 获取单元路径
    const unitPath = FACTORY_UNITS[unit];
    if (!unitPath) {
        alert('未知的单元名称');
        return;
    }
    
    // 拼接完整URL并打开
    const fullUrl = baseUrl + unitPath;
    window.open(fullUrl, '_blank');
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