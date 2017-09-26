function broadcast(componentName, eventName, params1, params2, EventType) {
    this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat([params1,params2,EventType]));
        } else {
            // todo 如果 params 是空数组，接收到的会是 undefined
            broadcast.apply(child, [componentName, eventName].concat([params1,params2,EventType]));
        }
    });
}
export default {
    methods: {
        dispatch(componentName, eventName, params, eventType) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat([params,eventType]));
            }
        },
        broadcast(componentName, eventName, params1, params2, EventType) {
            broadcast.call(this, componentName, eventName, params1, params2, EventType);
        }
    }
};