// pages/homePage/index/index.js
const app = getApp()
Page({
  data: {
    headHeight: 0, //计算头部高度
    imgUrls: [], //banner图
    indicatorDots: false, //是否显示小圆点
    vertical: false, //滑动方向，横向|纵向
    autoplay: true, //自动滑动
    duration: '500', //滑动时间
    interval: '2000', //每一个图片滑动的间隔时间
    circular: true, //是否采用衔接滑动
    swiperCurrent: 0, //当前所在的页面
    newKind: [],
    tabbarIndex: 0, //默认选择的分类
    newList: [],
    baseUrl: 'https://hhh.juzhibaina.com/',
    page: 1,
    per_page: '3',
    key_work: '',
    category_id: '',
    isMoreData: false,
    isShowPlayLive: true
  },
  gotoLive() {
    wx.switchTab({
      url: '../../liveBroadcast/index/index',
    })
  },
  gotoinfo() {
    wx.navigateTo({
      url: '../message/message',
    })
  },
  hidePlayLive() {
    this.setData({
      isShowPlayLive: false
    })
  },
  onLoad(options) {
    this.setData({
      headHeight: app.globalData.navHeight
    });
  },
  onShow() {
    this.setData({
      isShowPlayLive: true
    })
    this.getNewCategory()
    this.getBanner()
  },
  imgToDetail(e) {
    if (wx.getStorageSync('tourist_id')) {
      const index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: `../../imgDetail/index?index=${index}`,
      })
    } else {
      this.gotoLogin()
    }
  },
  gotoNewDetial(e) {
    if (wx.getStorageSync('tourist_id')) {
      const new_id = e.currentTarget.dataset.new_id
      wx.navigateTo({
        url: `../../newDetail/index?new_id=${new_id}`,
      })
    } else {
      this.gotoLogin()
    }

  },
  gotoLogin() {
    wx.showModal({
      title: '提示',
      content: '未登录请先去登录！',
      confirmText: '去登录',
      cancelText: '取消',
      success: res => {
        if (!res.cancel) {
          wx.navigateTo({
            url: '../../my/login/index',
          })
        }
      }
    })
  },
  //获取轮播图
  getBanner() {
    app.severApi({
      url: 'homepage/banner'
    }).then(({
      data
    }) => {
      const dataLikst = []
      console.log(data)
      for (const iterator of data) {
        dataLikst.push(`${this.data.baseUrl}${iterator.img.replace(/\\/g,"/")}`)
      }
      this.setData({
        imgUrls: dataLikst
      })
    })
  },
  //获取新闻分类
  getNewCategory() {
    app.severApi({
      url: 'homepage/category'
    }).then(({
      data
    }) => {
      let newdata = data
      newdata.push({
        name: ''
      })
      if (wx.getStorageSync('index')) {
        const indexs = wx.getStorageSync('index')
        newdata.forEach((value, index) => {
          if (index == indexs) {
            this.setData({
              tabbarIndex: indexs,
              category_id: value.id
            })
          }
        });
      } else {
        this.setData({
          tabbarIndex: 0,
          category_id: newdata[0].id
        })
      }
      this.setData({
        newKind: newdata,
      })
      this.getKindList()
    })
  },
  //获取分类列表
  getKindList() {
    const category_id = this.data.category_id
    const page = this.data.page
    const per_page = this.data.per_page
    const key_work = this.data.key_work
    app.severApi({
      url: 'homepage/news',
      data: {
        category_id: category_id,
        page: 1,
        per_page: per_page * page,
        key_work: key_work
      }
    }).then(({
      data
    }) => {
      console.log(data)
      const dataList = []
      for (const iterator of data.data) {
        dataList.push({
          title: iterator.title,
          pic: `${this.data.baseUrl}${iterator.img.replace(/\\/g,"/")}`,
          time: iterator.updated_at,
          new_id: iterator.id
        })
      }
      this.setData({
        newList: dataList,
        isMoreData: data.total <= dataList.length
      })
    })
  },
  //进入搜索
  goToSearch() {
    wx.navigateTo({
      url: '../searchRuselt/searchRuselt',
    })
  },
  //跳转分类
  goToKind() {
    const tabbarIndex = this.data.tabbarIndex
    wx.navigateTo({
      url: `../newKinds/newKinds?index=${tabbarIndex}`,
    })
  },
  //轮播图的切换事件  
  swiperChange(e) {
    let source = e.detail.source
    if (source === 'autoplay' || source === 'touch') {
      this.setData({
        swiperCurrent: e.detail.current //获取当前轮播图片的下标
      })
    }
  },
  //改变新闻种类
  changeNewKinds(e) {
    const index = e.currentTarget.dataset.index
    wx.setStorageSync('index', index)
    const id = e.currentTarget.dataset.id
    this.setData({
      tabbarIndex: index,
      page: 1,
      newList: [],
      category_id: id,
    })
    this.getKindList()
  },
  onReachBottom() {

    if (!this.data.isMoreData) {
      this.setData({
        page: this.data.page + 1
      })
      this.getKindList()
    }

  }
})