let scrollDelay
function pageScroll() {
    window.scrollBy(0, -50)
    scrollDelay = setTimeout(pageScroll, 10)
    if ($(window).scrollTop() <= 10) {
        clearTimeout(scrollDelay)
    }
}
$(document).ready(function () {
    $('#totop').click(pageScroll)
})

function VtException(message) {
    this.message = message;
    this.name = "Exception";
}

let evol = new Vue({
    el: '#app',
    data: {
        peel: Math.floor(Math.random() * 2147483647),
        word: '等待开始',
        languages: [{
            id: 0,
            n: 'English',
            k: 'en'
        }, {
            id: 1,
            n: '中文（简体）',
            k: 'zh-CN'
        }, {
            id: 2,
            n: '中文（繁体）',
            k: 'zh-TW'
        }],
        tranFrom: '',
        tranTo: '',
        fromLang: 'auto',
        toLang: 'en',
        classInfo: [],
        availableClasses: [],
        animationSelects: ['none', 'scale', 'zoom', 'fade', 'fade up', 'fade down', 'fade left', 'fade right', 'horizontal flip', 'vertical flip', 'drop', 'fly up', 'fly down', 'fly left', 'fly right', 'swing left', 'swing right', 'swing up', 'swing down', 'slide left', 'slide right', 'slide up', 'slide down', 'browse', 'browse left', 'browse right', 'jiggle', 'flash', 'shake', 'pulse', 'tada', 'bounce'],
        animationSelect: 'fade',
        isStop: 1,
        classId: 4,
        delayTimer: 0,
        delayCounter: 500,
        nowTime: '',
        nowTimer: '',
        timer: '',
        mainTextStyle: "#app{opacity:0.7;background-color:rgba(255,255,255,.7) !important;backdrop-filter: blur(5px);}.mainText {font-size: 70px !important;font-weight: 300 !important;color: #FF1493 !important;}.Me {color: #47af50;}",
        say: 'Loading...',
        meRange: [],
        youRange: [],
        classmates: [{ id: 0, select: '物化生', name: '未知', sex: 0 }],
        randomCondition1: 'Class == 4',
        randomCondition2: 'Class == 4',
        meClasses: '',
        meSelects: '',
        youClasses: '',
        youSelects: '',
        serverStatus: 0,
        tranOK: 1
    },
    mounted() {
        let _this = this
        _this.nowTimer = setInterval(function () {
            _this.nowTime = moment().format('HH:mm:ss')
        }, 1000)
        _this.testServer()
    },
    beforeDestroy() {
        clearInterval(this.timer)
        clearInterval(this.nowTimer)
    },
    methods: {
        rand() {
            return this.peel = (214013 * this.peel + 2531011) % 2147483647
        },
        testServer() {
            axios({
                url: 'http://192.68.4.188:8000'
            }).then((response) => {
                this.serverStatus = 1
            })
        },
        tranit() {
            this.tranOK = 0
            axios({
                url: 'http://192.68.4.188:8000/translate', 
                params: {
                words: this.tranFrom,
                fromLang: this.fromLang,
                toLang: this.toLang
            }}).then((response) => {
                this.tranTo = ''
                for (let i = 0; i < response.data.sentences.length; ++i)
                    this.tranTo += response.data.sentences[i].trans + '\n'
                this.tranOK = 1
            })
                .catch(function (error) {
                    if (error.response) {
                        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                        this.tranTo = error.response.data;
                        this.tranTo += error.response.status;
                        this.tranTo += error.response.headers;
                    } else if (error.request) {
                        // 请求已经成功发起，但没有收到响应
                        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
                        // 而在node.js中是 http.ClientRequest 的实例
                        this.tranTo = error.request;
                    } else {
                        // 发送请求时出了点问题
                        this.tranTo = 'Error', error.message;
                    }
                    this.tranTo += error.config;
                })
        },
        stopToggle() {
            this.isStop = 1 - this.isStop
            if (this.isStop)
                clearInterval(this.timer)
            else {
                this.timer = setInterval(this.timeCount, 10)
            }
        },
        stop() {
            this.isStop = 1
            clearInterval(this.timer)
        },
        changeStyle() {
            try {
                $('#customizeStyle').html(this.mainTextStyle)
            }
            catch (err) {
                $('body')
                    .toast({
                        title: 'Oops!',
                        message: err.message,
                        showProgress: 'bottom',
                        classProgress: 'red',
                        class: 'red',
                        className: {
                            toast: 'ui message'
                        }
                    })
                    ;
            }
        },
        calcRange() {
            let _this = this
            try {
                _this.meRange = []
                for (let i = 0; i < _this.classmates.length; ++i) {
                    let Class = _this.classmates[i].class
                    let Name = _this.classmates[i].name
                    let Sex = _this.classmates[i].sex
                    let Select = _this.classmates[i].select
                    let Id = _this.classmates[i].id
                    if (eval(_this.randomCondition1))
                        _this.meRange.push(_this.classmates[i])
                }
                _this.youRange = []
                for (let i = 0; i < _this.classmates.length; ++i) {
                    let Class = _this.classmates[i].class
                    let Name = _this.classmates[i].name
                    let Sex = _this.classmates[i].sex
                    let Select = _this.classmates[i].select
                    let Id = _this.classmates[i].id
                    if (eval(_this.randomCondition2))
                        _this.youRange.push(_this.classmates[i])
                }
            }
            catch (err) {
                $('body')
                    .toast({
                        title: 'Oops!',
                        message: err.message,
                        showProgress: 'bottom',
                        classProgress: 'red',
                        class: 'red',
                        className: {
                            toast: 'ui message'
                        }
                    })
                    ;
                _this.stop()
            }
        },
        changeSay() {
            let _this = this
            try {
                _this.delayCounter = _this.delayTimer * 100
                let rand = _this.rand
                let me, you
                if (_this.delayTimer >= 1 && _this.animationSelect != 'none') {
                    if (_this.animationSelect == 'zoom' || _this.animationSelect == 'scale' || _this.animationSelect == 'drop'
                        || _this.animationSelect == 'fade' || _this.animationSelect == 'fade up' || _this.animationSelect == 'fade down' || _this.animationSelect == 'fade left' || _this.animationSelect == 'fade right'
                        || _this.animationSelect == 'fly left' || _this.animationSelect == 'fly right' || _this.animationSelect == 'fly up' || _this.animationSelect == 'fly down'
                        || _this.animationSelect == 'swing up' || _this.animationSelect == 'swing down' || _this.animationSelect == 'swing left' || _this.animationSelect == 'swing right'
                        || _this.animationSelect == 'slide up' || _this.animationSelect == 'slide down' || _this.animationSelect == 'slide left' || _this.animationSelect == 'slide right'
                        || _this.animationSelect == 'browse' || _this.animationSelect == 'browse left' || _this.animationSelect == 'browse right' || _this.animationSelect == 'horizontal flip' || _this.animationSelect == 'vertical flip')
                        $('.mainText').transition(_this.animationSelect + ' out')
                }
                _this.calcRange()
                if (_this.meRange.length == 0) {
                    throw new VtException("找不到符合条件的 我")
                    return
                }
                me = _this.meRange[rand() % _this.meRange.length].name
                if (_this.youRange.length == 0) {
                    throw new VtException("找不到符合条件的 你")
                    return
                }
                you = _this.youRange[rand() % _this.youRange.length].name
                me = "<span class='Me'>" + me + "</span>"
                you = "<span class='You'>" + you + "</span>"
                if (_this.delayTimer >= 1) {
                    setTimeout(() => {
                        _this.say = _this.word
                        let rpm = _this.say.match(/{{[a-zA-Z0-9\+\-\*\s\/]*}}/g)
                        if (rpm != null)
                            for (let i = 0; i < rpm.length; ++i) {
                                let pt = rpm[i].replace('{', '').replace('}', '').trim()
                                _this.say = _this.say.replace(rpm[i], eval(pt))
                            }
                    }, 300)
                }
                else {
                    _this.say = _this.word
                    let rpm = _this.say.match(/{{[a-zA-Z0-9\+\-\*\s\/]*}}/g)
                    if (rpm != null)
                        for (let i = 0; i < rpm.length; ++i) {
                            let pt = rpm[i].replace('{', '').replace('}', '').trim()
                            _this.say = _this.say.replace(rpm[i], eval(pt))
                        }
                }
                if (_this.delayTimer >= 1 && _this.animationSelect != 'none')
                    //$('.mainText').fadeIn(100)
                    $('.mainText').transition(_this.animationSelect)
            }
            catch (err) {
                $('body')
                    .toast({
                        title: 'Oops!',
                        message: err.message,
                        showProgress: 'bottom',
                        classProgress: 'red',
                        class: 'red',
                        className: {
                            toast: 'ui message'
                        }
                    })
                    ;
                _this.stop()
            }
        },
        doMeParse() {
            this.randomCondition1 = ''
            if (this.meClasses)
                this.randomCondition1 = '([' + this.meClasses + '].indexOf(Class) != -1)'
            if (this.meSelects) {
                if (this.randomCondition1 != '')
                    this.randomCondition1 += '&&'
                this.randomCondition1 +=
                    '(Select.indexOf("' + this.meSelects + '") != -1)'
            }
            this.calcRange()
        },
        doYouParse() {
            this.randomCondition2 = ''
            if (this.youClasses)
                this.randomCondition2 = '([' + this.youClasses + '].indexOf(Class) != -1)'
            if (this.youSelects) {
                if (this.randomCondition2 != '')
                    this.randomCondition2 += '&&'
                this.randomCondition2 +=
                    '(Select.indexOf("' + this.youSelects + '") != -1)'
            }
            this.calcRange()
        },
        timeCount() {
            let _this = this
            if (_this.delayCounter > 0) {
                --_this.delayCounter
            }
            else {
                if (!this.isStop)
                    _this.changeSay()
            }
        }
    },
    filters: {
        timize: function (value) {
            return "" + Math.floor(value / 100) + "." + (value % 100 < 10 ? '0' : '') + (value % 100)
        }
    }
})
$('.tabButton, .menu .item')
    .tab()
    ;
$('#inline_calendar')
    .calendar({
        type: 'date'
    })
    ;
function getData(data) {
    $('#rawData').val(JSON.stringify(data, null, '\t'))
    evol.word = data.word
    evol.say = "等待开始."
    evol.delayTimer = data.delayTime
    evol.delayCounter = data.delayTime * 100
    if (evol.classmates[0].name != '未知')
        return
    evol.classmates = []
    for (let i = 0; i < data.classData.length; ++i) {
        for (let j = 0; j < data.classData[i].classMates.length; ++j)
            data.classData[i].classMates[j]["class"] = data.classData[i].classId
        evol.classmates = evol.classmates.concat(data.classData[i].classMates)
        evol.classInfo.push(data.classData[i])
    }
    evol.classId = data.class
    evol.randomCondition1 = 'Class == ' + data.class
    evol.randomCondition2 = 'Class == ' + data.class
    evol.meClasses = data.class
    evol.youClasses = data.class
    evol.meClassRange = [4]
    evol.availableClasses = data.availableClasses
    evol.calcRange()
    setTimeout(() => {
        $('select.ui.dropdown')
            .dropdown()
            ;
    }, 10)
}

$('.message .close')
    .on('click', function () {
        $(this)
            .closest('.message')
            .transition('fade')
            ;
    })
    ;