const app = new Vue({
    el: "#app",
    data: {
        filtersShown: 0,
        options: {
            query: "",
            filters: {
                country: {
                    collection: [],
                    names: {},
                },
                brand: {
                    collection: [],
                    names: {},
                },
                available: {
                    collection: [],
                    names: {},
                },
            },
            sort_by: "popular",
        },
    },
    computed: {
        filterTags() {
            // Return all selected filters in the form of ``{ name: "Localized Name", value: "value", etc... }``.
            return Object.entries(this.options.filters).reduce(
                (tags, [category, { collection, names }]) => [
                    ...tags,
                    ...collection.map((value) => ({
                        name: names[value],
                        category,
                        value,
                    })),
                ],
                []
            );
        },
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
                    const names = this.options.filters[id].names;

                    // Use a Set to ensure that there's no filter values.
                    filters.add(selectElement.value);
                    filterCategory.collection = [...filters]; // Update the original array.

                    // Make a localized dictionary entry for this filter value.
                    names[selectElement.value] = selectedOption.textContent;
                    break;
                default:
                    // Otherwise:

                    this.options[`${namespace}_${id}`] = selectElement.value;
                    break;
            }

            // Reset the selected index to the default value.
            selectElement.selectedIndex = 0;

            // Submit the form.
            this.submitOptions(selectElement.form);
        },
        removeFilterTag(filterTag) {
            const filterCategory = this.options.filters[filterTag.category];
            const filters = new Set(filterCategory.collection);

            filters.delete(filterTag.value);
            filterCategory.collection = [...filters]; // Update the original array.

            // Submit the form.
            this.submitOptions(selectElement.form);
        },
        submitOptions(form) {
            console.log(form);
        },
    },
});
