import Applications from 'Assets/nls/ru/Applications.json';
import Common from 'Assets/nls/ru/Common.json';
import Polls from 'Assets/nls/ru/Polls.json';
import Survey from 'Assets/nls/ru/Survey.json';
import trn from './default.json';

// TODO Реализовать в будущем асинхронную загрузку модульных переводов
trn['ru'].Polls = Polls;
trn['ru'].Common = Common;
trn['ru'].Applications = Applications;
trn['ru'].Survey = Survey;

export {trn};
