import * as components from "./components";
import * as directives from "./directives";

/* eslint-disable no-var, no-undef, guard-for-in, object-shorthand */

const VuePlugin = {
    install: function(Vue) {
        // No need for installed checks here. From docs @https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin:
        // -  Vue.use automatically prevents you from using the same plugin more than once,
        // -  so calling it multiple times on the same plugin will install the plugin only once.

        // Register components
        for (var component in components) {
            Vue.component(component, components[component]);
        }

        // Register directives
        for (var directive in directives) {
            Vue.directive(directive, directives[directive]);
        }
    },
    // Switch to using webpack.DefinePlugin to inject these value from the package.json at build.
    version: "1.0.0-beta.7",
    name: "bootstrap-vue"
};

if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(VuePlugin);
}

export default VuePlugin;
