// pages/my/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://hhh.juzhibaina.com/',
    avatarUrl:'',
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo (e) {
    console.log(e)
    if(e.detail.errMsg == "getUserInfo:ok"){
      this.setData({
        avatarUrl:e.detail.userInfo.avatarUrl,
        nickName:e.detail.userInfo.nickName
      })            
    }
  }, 
  bindGetUserInfo(e) {
    let that = this  
    const  avatar = that.data.avatarUrl
    const  nickname = that.data.nickName
    console.log(avatar)
    console.log(nickname)
      wx.login({
        success(res) {
          if (res.code) {     
            if (e.detail.encryptedData) {    
              app.severApi({
                url: 'common/wxCode',
                data: {
                  encryptedData: e.detail.encryptedData,
                  code: res.code,
                  iv:  e.detail.iv
                }
              }).then(({data}) => {
                console.log(data)
                wx.setStorageSync('tourist_id',data.id)
                const userInfo = {
                  nickName: data.nickname,
                  avatarUrl:  `${that.data.baseUrl}${data.avatar.replace(/\\/g,"/")}`
                }
                wx.setStorageSync('userInfo', userInfo)
                //上传nickName 头像
                that.loadNickName()     
              }) 
            } else {      
              wx.showModal({        
                title: '警告',       
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',        
                showCancel: false,        
                confirmText: '返回授权',        
                success: function (res) {
                  if (res.confirm) {        
                    console.log('用户点击了“返回授权”');      
                  }     
                }       
              });        
            }            
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      }) 

  },
  //上传头像和昵称
  loadNickName(){
    const avatarUrl = this.data.avatarUrl
    const nickName = this.data.nickName
    app.severApi({
      url: 'common/info',
      data: {
        tourist_id:wx.getStorageSync('tourist_id'),
        avatar:avatarUrl,
        nickname:nickName
      }
    }).then((res) => {
      if(res.code == 200){
        wx.showToast({
          title: '授权成功！',
          success: res =>{
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)                 
          }
        }) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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