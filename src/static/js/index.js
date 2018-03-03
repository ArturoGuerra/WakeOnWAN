new Vue({
    el: "#app",
    data: {
       result: {
           text: null,
           status: null
       },
       macaddr: null,
       password: null,
       validMac: null,
       validPassword: null
    },
    methods: {
        sendData: function() {
            let body = {
                password: this.password,
                mac: this.macaddr
            }

            axios({
                method: 'post',
                url: '/post',
                data: body
            }).then(r => {
                this.result.status = 'is-success';
                this.result.text = r.data;
            }, e => {
                this.result.status = 'is-danger';
                this.result.text = e.response.data;
            })

        },
        validatePassword: function() {
            if (!this.password) {
               this.validPassword = 'is-danger';
               this.result.status = 'is-danger';
               this.result.text = 'Sorry invalid password';
               return false;
            } else {
               this.validPassword = 'is-success';
               return true;
            }
        },
        validateMac: function() {
            var re_mac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            if (re_mac.test(this.macaddr)) {
                this.validMac = 'is-success';
                return true
            } else {
                this.validMac = 'is-danger';
                this.result.status = 'is-danger';
                this.result.text = 'Sorry invalid mac address';
                return false
            }
        },
        checkForm: function(e) {
            let passed = true
            if (!this.validateMac()) {
                passed = false
                e.preventDefault();
            }
            if (!this.validatePassword()) {
                passed = false
                e.preventDefault();
            }
            if (!passed) return;
            this.sendData();
        }
    }
})
