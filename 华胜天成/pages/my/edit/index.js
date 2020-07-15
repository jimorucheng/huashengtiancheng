// pages/my/edit/index.js
const app = getApp()
import {
  setImgSrc
} from "../../../utils/util"
Page({
  data: {
    userImg: '',
    name: '',
    baseUrl: 'https://hhh.juzhibaina.com/'
  },

  onLoad: function (options) {

  },
  getuserInfo () {
    app.severApi({
      url: 'person/info',
      data: {
        tourist_id: wx.getStorageSync('tourist_id')
      }
    }).then(({data}) => {
      this.setData({
        name: data.nickname || '登录',
        userImg: `${data.avatar}` || '../../../imgs/logo.png',
        userid: data.person_id
      })
    }) 
  },
  onShow() {  
    this.getuserInfo()
  },
  changName () {
    wx.navigateTo({
      url: '../editname/index',
    })
  },
  changPic () {
    setImgSrc().then( res =>{
      this.setData({
        userImg: this.data.baseUrl + res
      })
      app.severApi({
        url: 'person/edit',
        data: {
          tourist_id: wx.getStorageSync('tourist_id'),
          avatar: this.data.baseUrl + res,
          nickName: this.data.name
        }
      }).then((res) => {
        if(res.code === 200) {
          wx.showToast({
            title: '更改成功',            
          })
          
        }
      }) 
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})