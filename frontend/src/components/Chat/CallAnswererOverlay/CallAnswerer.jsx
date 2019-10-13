import React, { useState, useEffect } from 'react';
import Cover from 'components/Cover';
import Center from 'components/Center';
import { NormalizedNickname } from 'components/Chat';
import LabeledComponent from 'components/LabeledComponent';
import PhoneAnswerIcon from 'components/componentIcons/PhoneAnswerIcon';
import WebcamIcon from 'components/componentIcons/WebcamIcon';
import PhoneHangupIcon from 'components/componentIcons/PhoneHangupIcon';
import { Avatar, Divider } from 'antd';
import Peer from 'utils/p2p/Peer.class';
import styles from './CallAnswerer.module.scss';
import PropTypes from 'prop-types';
import fetchAggregatedMediaDeviceInfo from 'utils/mediaDevices/fetchAggregatedMediaDeviceInfo';

const CallAnswerer = (props) => {
  const [inputOptions, setInputOptions] = useState({
    hasAudioInput: false,
    hasVideoInput: false
  });

  useEffect(() => {
    (async () => {
      try {
        const {
          hasAudioInput,
          hasVideoInput
        } = await fetchAggregatedMediaDeviceInfo();

        setInputOptions({
          hasAudioInput,
          hasVideoInput
        });
      } catch (exc) {
        throw exc;
      }
    })();
  }, [setInputOptions]);

  const { remotePeer, onAnswer, onReject } = props;
  
  if (!remotePeer) {
    return false;
  }

  const remoteNickname = remotePeer.getNickname();

  if (!inputOptions) {
    return false;
  }

  const {
    hasAudioInput = false,
    hasVideoInput = false
  } = inputOptions;
  
  return (
    <Cover className={styles['call-answerer']}>
      <Center>
        <div>
          <div className={styles['title-wrapper']}>
            Incoming call from <NormalizedNickname nickname={remoteNickname} />
          </div>

          <div className={styles['avatar-wrapper']}>
            <Avatar
              icon="user"
              size={80}
            />
          </div>

          <div className={styles['button-panel']}>

            {
              hasAudioInput &&
              <LabeledComponent
                label="Audio"
              >
                <button
                  onClick={() => onAnswer({
                    audio: hasAudioInput
                  })}
                  title="Answer with Audio"
                >
                  <PhoneAnswerIcon
                    className={styles['answer']}
                  />
                </button>
              </LabeledComponent>
            }

            {
              hasVideoInput &&
              <LabeledComponent
                label="Video"
              >
                <button
                  onClick={() => onAnswer({
                    audio: hasAudioInput,
                    video: hasVideoInput
                  })}
                  title="Answer with Audio &amp; Video"
                >
                  <WebcamIcon
                    className={styles['answer']}
                  />
                </button>
              </LabeledComponent>
            }

            <Divider type="vertical" className={styles['divider']} />

            <LabeledComponent
              label="Reject"
            >
              <button
                onClick={() => onReject()}
                title="Reject"
              >
                <PhoneHangupIcon
                  className={styles['reject']}
                />
              </button>
            </LabeledComponent>

          </div>
        </div>
      </Center>
    </Cover>
  )
};

CallAnswerer.propTypes = {
  remotePeer: PropTypes.instanceOf(Peer).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default CallAnswerer;