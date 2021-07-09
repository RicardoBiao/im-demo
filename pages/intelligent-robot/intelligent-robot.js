/*
 * @Author: liweibiao
 * @Date: 2021-07-07 16:08:36
 * @LastEditTime: 2021-07-09 18:19:29
 * @Description: 
 */
// pages/intelligent-robot/intelligent-robot.js


var wxSIPlugin = requirePlugin("WechatSI")
let SIManager = wxSIPlugin.getRecordRecognitionManager();

const questionMap = new Map();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function () {
      SIManager.onRecognize = function(res) {
        console.log("current result", res.result)
      }
      SIManager.onStop = function(res) {
        console.log("record file path", res.tempFilePath)
        console.log("result", res.result)
        console.log("this", this)
        this.send(res.result);
      }
      SIManager.onStart = function(res) {
        console.log("成功开始录音识别", res)
      }
      SIManager.onError = function(res) {
        console.error("error msg", res.msg)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否输入框模式
    isTextMode: true,
    chatList: [
      {
        type: 'other',
        ans_type: 1,
        friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
        unread: false,
        // friendName: 'Ricardo',
        content: '请问您想咨询以下哪个问题，可以点击问题或回复数字',
        timeStr: '2021-7-1 12:00:21',
        queryList: [
          '发票有哪些类型',
          '哪些发票可以入账',
          '发票怎么领取',
          '发票读入怎么操作',
        ],
        ansUseful: 0,
      },
      {
        type: 'other',
        ans_type: 4,
        imgUrl: 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/RicardoMusicCloud/images/235000-1584114600db79.png',
        ansUseful: 0,
      },
      {
        type: 'other',
        ans_type: 3,
        imgUrl: 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/RicardoMusicCloud/images/235000-1584114600db79.png',
        content: '请问您想咨询以下哪个问题，可以点击问题或回复数字',
        ansUseful: 0,
      },
      {
        type: 'other',
        ans_type: 2,
        file: {
          name: '操作手册',
          type: 'pdf',
          url: 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/%E6%88%91%E6%98%AF%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf',
        },
        ansUseful: 0,
      },
      {
        type: 'other',
        ans_type: 5,
        ansUseful: 0,
        videoUrl: 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/RicardoMusicCloud/video/6c974701358444789711847f5e5ebce7.mp4',
      },
      {
        type: 'time',
        time: '2021-7-1 12:00',
      },
      {
        type: 'me',
        friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
        unread: false,
        content: '你好啊',
      }
    ],
    scrollItem: '',
    pageHeight: 0,
    scrollHeight: '',
    inputHeight: 20,
    inputContent: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onLoad(options) {
      this.setData({
        pageHeight: wx.getSystemInfoSync().windowHeight
      })
      this.creatQuestionMap(
        [
          '发票有哪些类型',
          '哪些发票可以入账',
          '发票怎么领取',
          '发票读入怎么操作'
        ]
      )
    },
    changeActionMode() {
      this.setData({
        isTextMode: !this.data.isTextMode
      })
    },

    // Map存储数字和问题M
    creatQuestionMap(qs) {
      questionMap.clear();
      qs.forEach((q,index) => {
        questionMap.set(index+1, q)
      });
    },

    // 输入回调
    onInput(e) {
      // console.log('onInput===>', this.data.inputContent)
    },
    
    // 开始录音
    startRecord() {
      SIManager.start({duration:30000, lang: "zh_CN"})
    },

    // 停止录音
    stopRecord() {
      SIManager.stop();
    },
    

    send(voiceRes) {
      console.log('send===>', this.data.inputContent, voiceRes)
      if(voiceRes && !voiceRes.type) {
        this.data.inputContent = voiceRes
      }
      // 储存数字对应的文案
      var inputContent;
      if(this.data.inputContent != '') {

        // 添加时间
        this.addTimeMark();

        // Map内有该问题编号则inputContent为编号对应的问题
        if(questionMap.get(Number(this.data.inputContent))) {
          inputContent = questionMap.get(Number(this.data.inputContent))
        }

        // TODO: 待对接接口； inputContent 调接口的时间传这个
        this.mokeSend();
        
      } else {
        // 无输入内容
        // return

        // TODO: 调试待删除
        let ans = {
          ans_content: '这是问题的答案，这是问题的答案，这是问题的答案，这是问题的答案，这是问题的答案',
          ans_files: [
          {
            ans_file_name: '工具稍等暗示稍等.pdf',
            ans_file_id: '12312321113fsa1231'
          },
          {
            ans_file_name: '123123.pdf',
            ans_file_id: '12312321113fsa1231'
          },
          {
            ans_file_name: 'wddasd.pdf',
            ans_file_id: '12312321113fsa1231'
          }
        ]}
        this.initFilesChat(ans);
      }
    },

    // 调试发送
    mokeSend() {
      this.data.chatList.push({
        type: 'me',
        friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
        unread: false,
        content: this.data.inputContent,
        timeStr: '2021-7-1 12:00:21',
      })
      
      this.setData({
        chatList:  this.data.chatList,
        scrollItem: 'chat'+ (this.data.chatList.length - 1),
        inputContent: '',
      },()=>{
        console.log('scrollItem===>', this.data.scrollItem)
        setTimeout(()=>{
          this.data.chatList.push({
            ans_type: '1',
            type: 'other',
            friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
            unread: false,
            content: '小慧没能理解您的问题呢，您可尝试换个说法，或者点击【人工服务】进行人工咨询。',
            timeStr: '2021-7-1 12:00:21',
            ansUseful: 0,
          })
          this.data.chatList.push({
            ans_type: '1',
            type: 'other',
            friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
            unread: false,
            content: '小慧没能理解您的问题呢，您可尝试换个说法，或者点击【人工服务】进行人工咨询。',
            timeStr: '2021-7-1 12:00:21',
            ansUseful: 0,
            queryList: [
              '这是追加的问题',
              '这是追加的问题2',
              '这是追加的问题3',
            ]
          })
          this.creatQuestionMap([
            '这是追加的问题',
            '这是追加的问题2',
            '这是追加的问题3',
          ])
          this.setData({
            chatList:  this.data.chatList,
            scrollItem: 'chat'+ (this.data.chatList.length - 1),
            inputContent: '',
          })
        }, 2000)
      })
    },

    // 添加时间（不渲染页面）
    addTimeMark() {
      this.data.chatList.push({
        type: 'time',
        time: this.getTimeStr()
      });
    },

    // 模仿接口返回数据
    getData() {

    },

    // 点击问题
    tapQuestion(e) {
      if(e.currentTarget.dataset.query) {
        this.data.inputContent = e.currentTarget.dataset.query;
        this.send();
      }
    },

    // 行高变化，自动计算scrollview的高
    lineChange(e) {
      console.log('lineChange-e===>', e)
      // 最高设置为100px
      let inputHeight = e.detail.height > 100 ? 100 : e.detail.height < 20 ? 20 : e.detail.height
      this.setData({
        inputHeight,
        scrollItem: 'chat'+ (this.data.chatList.length - 1),
        scrollHeight: wx.getSystemInfoSync().windowHeight - (inputHeight + 80),
      })
    },

    // 点击图片全屏预览
    previewImage(e) {
      console.log('previewImage===>', e)
      let url = e.currentTarget.dataset.url;
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [
          url,
        ] // 需要预览的图片http链接列表
      })
    },
    
    // 点击有用\无用控件
    usefulHandle(e) {
      let {
        index,
        useful
      } = e.currentTarget.dataset

      if(this.data.chatList[index].ansUseful != 0) {
        return
      }
      // TODO: 对接问题是否有用接口
      this.data.chatList[index].ansUseful = useful;
      this.setData({
        chatList: this.data.chatList
      })
      wx.showToast({
        title: '感谢您的反馈',
        icon: 'none'
      })
    },

    // 获取当前时间字符串
    getTimeStr() {
      let time = new Date(),
      nowYear  = time.getFullYear(),
      nowMonth  = time.getMonth() + 1,
      nowDay = time.getDate(),
      nowHour = time.getHours(),
      nowMinute = time.getMinutes();
      console.log('nowTime===>', nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour + ':' + (nowMinute < 10 ? '0'+nowMinute : nowMinute) )
      let nowTime = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour + ':' + (nowMinute < 10 ? '0'+nowMinute : nowMinute)
      return nowTime
    },
    
    // 拆分文件、文本类型回答  TODO: 待抽象进behavior
    initFilesChat(ans) {
      let that = this;
      that.data.chatList.push({
        type: 'other',
        ans_type: 1,
        content: ans.ans_content,
        ansUseful: null,
      })
      ans.ans_files.forEach((fl,index) => {
        that.data.chatList.push({
          type: 'other',
          ans_type: 2,
          file: {
            name: fl.ans_file_name,
            type: 'pdf',
            url: that.getFileUrlForId(fl.ans_file_id),
          },
          ansUseful: index == ans.ans_files.length - 1 ? 0 : null,
        })
      })
      that.setData({
        chatList: that.data.chatList,
        scrollItem: 'chat'+ (this.data.chatList.length - 1),
        inputContent: '',
      })
    },

    // 根据文件id获取文件url  TODO: 待抽象进behavior
    getFileUrlForId(id) {
      return 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/%E6%88%91%E6%98%AF%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf'
    },

    // 下载并打开文件 TODO: 待抽象进behavior
    downloadFile(e) {
      let file = e.currentTarget.dataset.file;
      wx.downloadFile({
        url: file.url,
        filePath: `${wx.env.USER_DATA_PATH}/hsz_robot_ans_files/${file.name}.${file.type}`, // 本地存储路径
        success (res) {
          console.log('downloadFile-res ===>', res)
          if (res.statusCode === 200) {
            const filePath = res.filePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          }
        },
        fail (err) {
          console.log('downloadFile-err ===>', err)
        },
      })
    },

  }
})
