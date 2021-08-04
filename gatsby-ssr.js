var _react = require("react");
var _react2 = _interopRequireDefault(_react);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function(_ref, pluginOptions) {
    var setHeadComponents = _ref.setHeadComponents;

    var apiKey = pluginOptions.apiKey,
        org = pluginOptions.org

    // if process.env.NODE_ENV === "development" handle stream / meta value

    var snippet = `
    (function loadYolk(options) {
        if (yolk) {
            // guard against destroying real version of yolk.js if already
            // loaded, eg by \`<script>\` tag
            // attach any user-supplied options to the \`yolk\` Object
            yolk.options = options || {}
            // start yolk -
            if (yolk.start instanceof Function) {
            console.warn("yolk already loaded - starting anyway")
            yolk.start()
            } else {
            console.error("Yolk disabled: \`yolk\` Object exists but is the wrong type")
            }
        } else {
            // create the initial \`yolk\` object. When the library loads this
            // will be merged with the _real_ object. Any supplied \`options\`
            // will be attached here.
            var yolk = {
            functionQueue: [],
            options: options || {},
            }
            // attach the local \`yolk\` Object to the global \`window\` scope
            window.yolk = yolk
            // Define the method **names** of the public \`yolk.js\` API
            var apiMethods = [
            "event",
            "context",
            "identify",
            "alias",
            "view",
            "track",
            ]
            // Enqueue a function to replay later by adding an \`Object\` to
            // \`yolk.functionQueue\` containing the called function name and
            // its arguments:
            function enqueueFn(fn, args) {
            if (fn == null) {
                console.error("missing function name in snippet enqueue() - queued function ignored")
            } else {
                var item = {fn: fn, args: args}
                yolk.functionQueue.push(item)
            }
            }
            // Create methods on \`yolk\` Object corresponding to each method
            // named in \`apiMethods\`. These will be replaced with the real
            // methods when \`yolk.js\` loads
            for (let i = 0; i < apiMethods.length; i++) {
            // scoping \`fn\` here required for ie
            var fn = apiMethods[i]
            yolk[apiMethods[i]] = function () {
                enqueueFn(fn, Array.prototype.slice.call(arguments));
            };
            }
            // load the main script by inserting \`<script>\` tags into the DOM
            var scriptElement = document.createElement('script');
            var scriptUrl = yolk.options.yolkJsUrl || (
            yolk.options.version ?
                "https://cdn.yolk.automateorbeautomated.com/public/yolk/yolk-tracker/yolk-tracker-" + yolk.options.version + ".js" :
                "/yolk-tracker.js"
            )
            scriptElement.type = 'text/javascript';
            scriptElement.async = true;
            scriptElement.src = scriptUrl;
            // run \`yolk.start()\` once the library is fully loaded
            scriptElement.addEventListener('load', function() {yolk.start()});
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
        }
        })(
        {
            apiKey:"` + apiKey + `",
            org:` + org + `,
            version: "0.0.0-e553477",
        });
    `

    if (apiKey) {
        setHeadComponents([_react2.default.createElement("script", {
          key: "plugin-yolk",
          dangerouslySetInnerHTML: { __html: snippet }
        })]);
    }
}