/*
 * @Author: liweibiao
 * @Date: 2021-07-07 16:08:36
 * @LastEditTime: 2021-07-09 11:47:43
 * @Description: 
 */
// pages/intelligent-robot/intelligent-robot.js

const questionMap = new Map();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
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
        time: '2021-7-1 12:00:21',
      },
      {
        type: 'me',
        friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
        unread: false,
        // friendName: 'Ricardo',
        content: '你好啊',
        timeStr: '2021-7-1 12:00:21',
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
    aaa(e) {
      console.log('e===>', e)
    },


    creatQuestionMap(qs) {
      questionMap.clear();
      qs.forEach((q,index) => {
        questionMap.set(index+1, q)
      });
    },

    onInput(e) {
      // console.log('onInput===>', this.data.inputContent)
    },

    send() {
      console.log('inputContent===>', this.data.inputContent)
      // console.log(this)
      console.log('map',questionMap,questionMap.get(Number(this.data.inputContent)))
      var inputContent;
      if(this.data.inputContent) {
        // Map内有该问题编号则inputContent为编号对应的问题
        if(questionMap.get(Number(this.data.inputContent))) {
          inputContent = questionMap.get(Number(this.data.inputContent))
        }

        // TODO: inputContent 调接口的时间传这个

        
        this.data.chatList.push({
          type: 'me',
          friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
          unread: false,
          // friendName: 'Ricardo',
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
      } else {
        return
      }
    },


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

    // 下载文件
    downloadFile(e) {
      let file = e.currentTarget.dataset.file;
      wx.downloadFile({
        url: file.url,
        filePath: `${wx.env.USER_DATA_PATH}/${file.name}.${file.type}`, // 本地存储路径
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
    }
    
  }
})
