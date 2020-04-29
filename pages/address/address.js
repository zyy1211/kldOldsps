//logs.js
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let Api = require('../../utils/config');
let util = require('../../utils/util')
let App = getApp();
Page({
    data: {
        pois: [],
        searchValue: '',
        city:'杭州'
    },
    onLoad: function (option) {
        let self = this;
        self.setData({
            address: option.address
        })
        self.getFixedLocation();
    },
    getFixedLocation: function () {
        let self = this;
        self.setData({
            address: '定位中...'
        });
        self.selectComponent('#authorize').getAuthorizeLocation(self.getLocationName)
    },
    getLocationName: function (t) {
        let self = this;
        let map = new QQMapWX({
            key: Api.QQmapsdkKey
        });
        let latitude = t.latitude || Api.latitude;
        let longitude = t.longitude || Api.longitude;
        this.setData({
            latitude: latitude,
            longitude: longitude
        })
        map.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: function (t) {
                console.log(t)
                let address = t.result.formatted_addresses.recommend;
                self.setData({
                    address: address,
                    latitude: t.result.location.lat,
                    longitude: t.result.location.lng,
                    city:t.result.address_component.city
                })


            },
            fail: function (e) {
                console.log(e)
            }
        })
    },

    bindAddressInput: function () {
        let self = this;
        let map = new QQMapWX({
            key: Api.QQmapsdkKey
        });
        let latitude = self.data.latitude;
        let longitude = self.data.longitude;
        let city = self.data.city;
        map.getSuggestion({
            keyword: self.data.searchValue,
            region: city,
            location: latitude,
            longitude,
            success: function (res) {
                let data = res.data;
                data.forEach(item => {
                    let disc = util.distance(
                        item.location.lat,
                        item.location.lng,
                        latitude,
                        longitude
                    );
                    item.distance = disc.toFixed(2);
                })
                self.setData({
                    adsList: res.data
                })
            }
        })
    },
    scInput: function (e) {
        this.setData({
            searchValue: e.detail.value
        })
    },
    choiseGps: function () {
        let self = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一级页面
        prevPage.setData({
            latitude: self.data.latitude,
            longitude: self.data.longitude,
            address: self.data.address
        });
        prevPage.reloadPage();
        wx.navigateBack({
            delta: 1
        })

    },
    choiseLocation: function (e) {
        let item = e.currentTarget.dataset.item;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一级页面
        prevPage.setData({
            latitude: item.location.lat,
            longitude: item.location.lng,
            address: item.title
        });
        prevPage.reloadPage();
        wx.navigateBack({
            delta: 1
        })
    },
    navigator: function () {
        wx.navigateTo({
            url: '../city/city'
        })
    }
})