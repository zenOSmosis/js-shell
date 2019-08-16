// Abstracted components/Button
import Button from '../Button';

// Antd ButtonGroup
import {Button as AntdButton} from 'antd';
const {Group: ButtonGroup} = AntdButton;

export default ButtonGroup;

// Mixed components/Button w/ Antd ButtonGroup
export {
  Button,
  ButtonGroup
}