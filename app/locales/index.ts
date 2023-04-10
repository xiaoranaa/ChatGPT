import CN from "./cn";
import EN from "./en";
import TW from "./tw";
import ES from "./es";
import IT from "./it";

export type {LocaleType} from "./cn";

export const AllLangs = ["en", "cn", "tw", "es", "it"] as const;
export const synth = getSynth();
export const AllVoices = getAllVoices().then((voices: SpeechSynthesisVoice[]) => {
    return voices;
});

type Lang = (typeof AllLangs)[number];

const LANG_KEY = "lang";
const TONE_KEY = "voice";

function getItem(key: string) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function setItem(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
    }
}

function getLanguage() {
    try {
        return navigator.language.toLowerCase();
    } catch {
        return "cn";
    }
}

function getSynth(): SpeechSynthesis | null {
    return window.speechSynthesis;
}

function getAllVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
        // 监听声音列表变化事件
        synth?.addEventListener('voiceschanged', () => {
            //const allVoices = synth.getVoices();
            //这里过滤了只展示国内的声音  如果想要获取所有声音则返回上行代码的allVoices
            const chineseVoices = synth.getVoices().filter((voice) => voice.lang.includes("zh-"));
            resolve(chineseVoices || []);
        });
    });
}

export function getLang(): Lang {
    const savedLang = getItem(LANG_KEY);

    if (AllLangs.includes((savedLang ?? "") as Lang)) {
        return savedLang as Lang;
    }

    const lang = getLanguage();

    if (lang.includes("zh") || lang.includes("cn")) {
        return "cn";
    } else if (lang.includes("tw")) {
        return "tw";
    } else if (lang.includes("es")) {
        return "es";
    } else if (lang.includes("it")) {
        return "it";
    } else {
        return "en";
    }
}

export function changeLang(lang: Lang) {
    setItem(LANG_KEY, lang);
    location.reload();
}

export function getVoice(): any {
    return getItem(TONE_KEY);
}

export function changeVoice(voice: any) {
    setItem(TONE_KEY, voice);
    location.reload();
}

export default {en: EN, cn: CN, tw: TW, es: ES, it: IT}[getLang()];
