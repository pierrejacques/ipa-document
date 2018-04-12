export default (href, cb = () => {}) => {
    
    if (href.match(location.host)) {
        location = href;
        cb();
    } else {
        window.open(href);
    }
}