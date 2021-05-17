// Create a new Vue instance on #app.
const app = new Vue({
    el: "#app",
    data: {
        filtersShown: 0,
        options: {
            query: "",
            filters: {
                country: {
                    collection: [],
                    names: [],
                },
                brand: {
                    collection: [],
                    names: [],
                },
                available: {
                    collection: [],
                    names: [],
                },
            },
            sort_by: "popular",
        },
        results: {},
    },
    computed: {
        filterTags() {
            // Return all selected filters in the form of ``{ name: "Localized Name", value: "value", etc... }``.
            return Object.entries(this.options.filters).reduce(
                (tags, [category, { collection, names }]) => [
                    ...tags,
                    ...collection.map((value) => ({
                        name: new Map(names).get(value),
                        category,
                        value,
                    })),
                ],
                []
            );
        },
    },
    mounted() {
        // When the site loads, set the filters to match those in the URL.
        const url = new URL(window.location);
        const options = JSON.parse(url.searchParams.get("q") || "{}");
        safeAssignObject(this.options, options);
    },
    methods: {
        toggleFiltersShown() {
            this.filtersShown ^= 1;
        },
        onSelectOption(event) {
            const selectElement = event.target;
            const selectedOption = selectElement[selectElement.selectedIndex];

            // Take the name of the input and split it into a namespace and an ID.
            // The name is in the format of namespace_ID.
            const [namespace, id] = selectElement.name.split(/_/g, 2);

            switch (namespace) {
                case "filter":
                    //  If the namespace of the input is "filter":
                    //      Add the selected filter value to its corresponding category based on ``id``.

                    const filterCategory = this.options.filters[id];
                    const filters = new Set(filterCategory.collection);
                    const names = new Map(this.options.filters[id].names);

                    // Use a Set to ensure that there's no filter values.
                    filters.add(selectElement.value);
                    filterCategory.collection = [...filters]; // Update the original array.

                    // Make a localized dictionary entry for this filter value.
                    names.set(selectElement.value, selectedOption.textContent);
                    this.options.filters[id].names = [...names.entries()];

                    break;
                default:
                    // Otherwise:

                    this.options[`${namespace}_${id}`] = selectElement.value;
                    break;
            }

            // Reset the selected index to the default value.
            selectElement.selectedIndex = 0;

            // Submit the form.
            this.submit();
        },
        removeFilterTag(filterTag) {
            const filterCategory = this.options.filters[filterTag.category];
            const filters = new Set(filterCategory.collection);

            filters.delete(filterTag.value);
            filterCategory.collection = [...filters]; // Update the original array.

            // Submit the form.
            this.submit();
        },
        async submit() {
            window.history.pushState(
                null,
                null,
                `/browse?q=${encodeURIComponent(JSON.stringify(this.options))}`
            );

            try {
                const response = await axios.post("/browse", this.options);
                this.results = response;
            } catch (err) {
                const response = err.response;
                // TODO: Handle error.
            }
        },
    },
});

/**
 * Recursively assign values in target object (replacing arrays) with corresponding values in the source object.
 *
 * @param {*} target
 * @param {*} source
 */
function safeAssignObject(target, source) {
    for (const [p] of Object.entries(target)) {
        if (source[p] == null) continue;
        if (typeof target[p] !== typeof source[p]) continue;

        if (typeof target[p] === "object" && !Array.isArray(target[p])) {
            safeAssignObject(target[p], source[p]);
        } else {
            target[p] = source[p];
            console.log(p);
        }
    }
}
