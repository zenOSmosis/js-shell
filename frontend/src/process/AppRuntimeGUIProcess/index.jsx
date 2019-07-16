import ClientGUIProcess, {
  EVT_GUI_PROCESS_FOCUS,
  EVT_GUI_PROCESS_BLUR
} from '../ClientGUIProcess';

/**
 * Base on which AppRuntime extends.
 * 
 * Specifically, it handles dynamic focusing and blurring of Desktop apps.
 */
export default class AppRuntimeGUIProcess extends ClientGUIProcess {
  constructor(...args) {
    super(...args);

    this.on(EVT_GUI_PROCESS_FOCUS, () => {
      // TODO: Handle accordingly
      console.debug('FOCUSED', this);
    });

    this.on(EVT_GUI_PROCESS_BLUR, () => {
      // TODO: Handle accordingly 
      console.debug('BLURRED', this);
    });
  }
}