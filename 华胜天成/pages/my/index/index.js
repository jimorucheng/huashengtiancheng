// pages/my/index/index.js
const app = getApp()
Page({
  data: {
    ischooseAll: false,
    name: '登录',
    userid: "",
    isClickDelete: false,
    dataList: [],
    userImg:'../../../imgs/logo.png',
    page: 1,
    baseUrl: 'https://hhh.juzhibaina.com/',
    isMoreData: false
  },
  wxlogin () {
    if(this.data.name === '登录') {
      wx.navigateTo({
        url: '../login/index',
      })
    }  
  },
  gotoDetail (e) {
    const browse_id = e.currentTarget.dataset.browse_id;
    wx.navigateTo({
      url: `../../newDetail/index?new_id=${browse_id}`,
    })
  },
  toEditInfo () {
    if(this.data.name !== '登录') {
      wx.navigateTo({
        url: '../edit/index',
      })
    }   
  },
  deleteDetial () {
    const newArr = []
    for (const iterator of this.data.dataList) {
      if(iterator.isClick){
        newArr.push(iterator.deleteId)
      }
    }
    app.severApi({
      url: 'person/delete',
      data: {
        tourist_id: wx.getStorageSync('tourist_id'),
        browse_id: newArr.join(',')
      }
    }).then((res) => {
      if(res.code === 200 ) {
        this.getDetail(),
        this.setData({
          ischooseAll: false
        })
      }   
    }) 
  },
  isChooseDelete (e) {
    const index = e.currentTarget.dataset.index;
    const dataList = this.data.dataList
    dataList[index].isClick = !dataList[index].isClick
    this.setData({
      dataList: dataList
    })
  },
  chooseAll () {
    const dataList = this.data.dataList
    this.setData({
      ischooseAll: !this.data.ischooseAll
    })
    for (const iterator of dataList) {
      iterator.isClick = this.data.ischooseAll
    }
    this.setData({
      dataList: dataList
    })
  },
  clickDelete () {
    if(this.data.dataList.length > 0){
      this.setData({
        isClickDelete: true
      })
    }else {
      wx.showToast({
        title: '暂无浏览记录',
        icon: 'none'
      })
    }   
  },
  clickComplete () {
    this.setData({
      isClickDelete: false
    })
  },
  onShow() {
    this.getuserInfo()
    // 浏览记录
    this.getDetail()
  },
  getuserInfo () {
    if(wx.getStorageSync('tourist_id')) {
      app.severApi({
        url: 'person/info',
        data: {
          tourist_id: wx.getStorageSync('tourist_id')
        }
      }).then(({data}) => {
        const nickname = data.nickname.length >=7 ? data.nickname.substr(0, 6)+ '...' : data.nickname
        this.setData({
          name:  nickname || '登录',
          userImg: `${data.avatar}` || '../../../imgs/logo.png',
          userid: data.person_id
        })
      }) 
    }   
  },
  getDetail () {
    if(wx.getStorageSync('tourist_id')) {
      app.severApi({
        url: 'person/browse',
        data: {
          tourist_id: wx.getStorageSync('tourist_id'),
          per_page: 10 * this.data.page,
          page: 1
        }
      }).then((res) => {
        const data = res.data
        console.log(data)
        const newArr = []
        for (const iterator of data.data) {
          newArr.push({
            desc: iterator.world_new.title,
            img: `https://hhh.juzhibaina.com/${iterator.world_new.img.replace(/\\/g,"/")}`,
            time: iterator.world_new.created_at.substr(0, 10),
            isClick: false,
            browse_id: iterator.world_new_id,
            deleteId: iterator.id
          })
        }111
        this.setData({
          dataList: newArr,
          isMoreData: data.total <= newArr.length
        })
      }) 
    }     
  },
    /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    if(!this.data.isMoreData) {
      this.setData({
        page: this.data.page + 1
      })
      this.getDetail ()
    }    
  }
})