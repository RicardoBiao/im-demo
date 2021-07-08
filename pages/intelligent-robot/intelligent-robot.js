/*
 * @Author: liweibiao
 * @Date: 2021-07-07 16:08:36
 * @LastEditTime: 2021-07-08 17:23:48
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
        ans_type: 5,
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
        ]
      },
      {
        type: 'other',
        ans_type: 4,
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
        ]
      },
      {
        type: 'time',
        time: '2021-7-1 12:00:21',
      },
      {
        type: 'me',
        friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
        unread: false,
        friendName: 'Ricardo',
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

      if(this.data.inputContent) {
        // Map内有该问题编号则inputContent为编号对应的问题
        if(questionMap.get(Number(this.data.inputContent))) {
          this.data.inputContent = questionMap.get(Number(this.data.inputContent))
        }

        
        this.data.chatList.push({
          type: 'me',
          friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
          unread: false,
          friendName: 'Ricardo',
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
              type: 'other',
              friendHeadUrl: 'https://chouka.oss-cn-hangzhou.aliyuncs.com/product_img.png',
              unread: false,
              content: '小慧没能理解您的问题呢，您可尝试换个说法，或者点击【人工服务】进行人工咨询。',
              timeStr: '2021-7-1 12:00:21',
            })
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
    
  }
})
