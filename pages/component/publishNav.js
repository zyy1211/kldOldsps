// var t = require("../utils/util.js");


let App = getApp();

Component({
    properties:{
        type: {
            type: String,
            value: '',  
        }
    },
    data: {
        showAddModal: !1,
        dataList: []
    },

    ready: function () {
        let self = this;
        if (this.data.type === 'game') {
            self.setData({
                dataList: [{
                    pagePath: "/gamePages/pages/g_issue/g_issue?id=-1",
                    text: "赛事发布",
                    iconPath: "/pages/images/m_sais.png",
                    type: "game"
                }]
            })
        }else{
            self.setData({
                dataList: [{
                    pagePath: "/pages/issue/issue?id=-1",
                    text: "活动发布",
                    iconPath: "/pages/images/m_huod.png",
                    type: "activity"
                }]
            }) 
        }
    },
    methods: {
        bindShowAddModal: function (e) {
            if (this.data.animation) {
                this.setData({
                    showAddModal: !1,
                    animation: !1
                })
                return;
            }
            this.setData({
                showAddModal: !0,
                animation: !0
            })
        },
        catchTap: function () {
            return !1;
        },
        navigateToPublish: function (e) {
            let self = this;
            this.bindShowAddModal();
            let url = e.currentTarget.dataset.url;
            App.isToDetail(function () {
                wx.navigateTo({
                    url: url
                })
            })
        },
    }
});