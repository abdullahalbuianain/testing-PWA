var webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'Lesson Booking',
        lessons: lesson,
        cart: [],
        order: {
            firstName: '',
            number: '',
            total: 0
        },
        showlessons: true,
    },




    computed: {

        canAddToCart: function() {
            return function(lesson) {
            return lesson.spaces > 0;
        }
  }



},

        
methods: {
        addToCart: function(lesson) {
            if(lesson.spaces > 0) {
                lesson.spaces--;
                this.cart.push(lesson);
                this.order.total += parseFloat(lesson.price.slice(1));
            }
        },
        removeFromCart: function(lesson) {
            var index = this.cart.indexOf(lesson);
            this.cart.splice(index, 1);
            this.order.total -= parseFloat(lesson.price.slice(1));
        },
        showCheckout: function() {
            this.showlessons = !this.showlessons;
        },
        submitForm: function() {
            alert("Thank you " + this.order.firstName + " for your order of " + this.cart.length + " lessons! Your total is $" + this.order.total + ".");
            this.order.firstName = '';
            this.order.number = '';
            this.cart = [];
            this.order.total = 0;
            this.showlessons = true;
        },
    

    sortLessons: function(location) {
        this.lessons.sort(function(a, b) {
            let propA, propB;
            if (location === 'price') {
                propA = parseFloat(a[location].slice(1));
                propB = parseFloat(b[location].slice(1));
            } else {
                propA = a[location].toLowerCase();
                propB = b[location].toLowerCase();
            }
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    sortLessons: function(subject) {
        this.lessons.sort(function(a, b) {
            let propA, propB;
            if (subject === 'price') {
                propA = parseFloat(a[subject].slice(1));
                propB = parseFloat(b[subject].slice(1));
            } else {
                propA = a[subject].toLowerCase();
                propB = b[subject].toLowerCase();
            }
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    sortLessons: function(sortType) {
    if (sortType === 'price') {
        this.lessons.sort(function(a, b) {
            let propA = parseFloat(a[sortType].slice(1));
            let propB = parseFloat(b[sortType].slice(1));
            return propA - propB;
        });
    } else {
        this.lessons.sort(function(a, b) {
            let propA = a[sortType].toLowerCase();
            let propB = b[sortType].toLowerCase();
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    }
},

},


})