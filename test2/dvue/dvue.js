function defineReactive(obj, key, val) {
    // 递归
    // 遍历深嵌套
    observe(val)

    let dep = new Dep();

    Object.defineProperty(obj, key, {
        get() {
            console.log("get", val)
            if (Dep.target) {
                dep.addDep(Dep.target)
            }
            return val
        },
        set(newVal) {
            // 闭包
            if (newVal !== val) {
                val = newVal;
                console.log("set", val)

                // 新值如果是对象，仍然需要递归遍历处理
                observe(newVal);

                dep.notify()
            }
        }
    })
}

function observe(obj) {
    if (typeof obj !== "object" || obj == null) {
        return obj
    }
    new Observe(obj)
}

class Observe {
    constructor(obj) {
        if (Array.isArray(obj)) {
            // 数组
        } else {
            // 对象
            this.walk(obj);
        }
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(v) {
                vm.$data[key] = v
            }
        })
    })
}

class DVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data

        // 数据做成响应式
        observe(this.$data)

        // 数据代理到this上
        proxy(this)

        // 编译模板
        new Compile(options.el, this)
    }
}

class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm

        if (this.$el) {
            this.compile(this.$el);
        }
    }

    compile(node) {
        const childNodes = node.childNodes

        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                // 标签元素
                this.compileElement(node)
                // 递归
                if (node.childNodes.length > 0) {
                    this.compile(node)
                }
            } else if (this.isInter(node)) {
                // 插值
                this.compileText(node)
            }
        })
    }

    compileText(n) {
        this.update(n, RegExp.$1, "text");
    }

    update(node, exp, dir) {
        if (dir) {
            const fn = this[dir + "Updater"]
            fn && fn(node, this.$vm[exp])

            new Watcher(this.$vm, exp, val => {
                fn && fn(node, val)
            })
        }
    }

    textUpdater(node, val) {
        node.textContent = val
    }

    // 更新文本
    text(node, exp) {
        this.update(node, exp, "text")
    }

    htmlUpdater(node, val) {
        node.innerHTML = val
    }

    // 更新html
    html(node, exp) {
        this.update(node, exp, "html")
    }

    isDir(attrName) {
        return attrName.startsWith("k-");
    }

    compileElement(node) {
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value
            // 指令
            if (this.isDir(attrName)) {
                const dir = attrName.substring(2);
                this[dir] && this[dir](node, exp)
            }
        })
    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}

class Watcher {
    constructor(vm, key, updater) {
        this.vm = vm
        this.key = key
        this.updater = updater

         // 触发一下get
        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update() {
        this.updater.call(this.vm, this.vm[this.key])
    }
}

class Dep {
    constructor() {
        this.deps = []  
    }

    addDep(watcher) {
        this.deps.push(watcher)
    }

    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}
