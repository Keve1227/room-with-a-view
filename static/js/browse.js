const app = new Vue({
    el: "#app",
    data: {
        filtersShown: 0,
    },
    methods: {
        toggleFiltersShown() {
            this.filtersShown ^= 1;
        },
    },
});
