const baseUrl = 'https://hhh.juzhibaina.com/api/'
const severApi = (prams) => {
  wx.showLoading({
    title: '正在加载...',
  })
  return new Promise((resolve, reject) => {  
    wx.request({  
      method: 'POST',
      ...prams,
      url: `${baseUrl}${prams.url}`,
      success: (res) => {
        wx.hideLoading()
        const code = res.data.code
        
        if (code === 200) {
          resolve(res.data)
        } else {
          console.log(res)
          wx.showToast({
            title: "数据加载失败",
            icon: "none"
          })
        }        
      }
    })
  }) 
}
module.exports = {
  severApi
}