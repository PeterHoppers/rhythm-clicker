const LOGGER_ELEMENT_ID = "Logger";

export function LogInfo(logLine: string) {
    const loggerElement = document.getElementById(LOGGER_ELEMENT_ID);
    if (!loggerElement) {
        return;
    }
    loggerElement.innerText += `\n${logLine}`;
}