export const arrayNormalize = data => {
    if (!(data instanceof Array)) {
        data = [data];
    }
    return data;
}
export const convertRemToPixels = rem => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
export const getFontSize = () => {
    return parseFloat(
        getComputedStyle(document.documentElement).fontSize
    );
}
/**
 * Replace with regex at some point - generating correct regex was a headache
 */
export const getThreeDVal = (menuWrapper) => {
    return Number(
        String(menuWrapper.style.transform)
            .split("(")
            .pop()
            .split("px,")[0]
    );
}
export const getMerchantIDFromPath = (location) => {
    return location.pathname.substr(
        location.pathname.lastIndexOf("/") + 1
    );
}
export const genChannelName = (merchantId, userId) => {
    return merchantId.toString() + "-" + userId.toString();
}