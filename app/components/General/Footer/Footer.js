import React, { Component } from 'react';
import { Button, Layout } from 'antd';
import CoolMusicPlayer from 'react-cool-music-player';

const { Footer } = Layout;
type Props = {};

export default class AppFooter extends Component<Props> {
  props: Props;

  constructor() {
    super();
  }

  render() {

    return <Footer style={{ textAlign: 'center', height: '80px', position: 'fixed', width: '100%', bottom: '0' }}>
      <CoolMusicPlayer
        playListPlaceholder={'No Data'}
        // onDelete={onDelete}
        data={this.props.player.list}
        icons={{
          playIcon: <Button size={'small'} type="primary" shape="circle" icon="play-circle"
                            onClick={this.props.player.status}/>,
          pauseIcon: <Button size={'small'} type="primary" shape="circle" icon="play-circle"
                             onClick={this.props.player.status}/>,
          prevIcon: <Button size={'small'} type="primary" shape="circle" icon="undo"/>,
          nextIcon: <Button size={'small'} type="primary" shape="circle" icon="redo"/>
        }}
        currentAudio={this.props.player.current}
        play={this.props.player.play}
        showLyricNormal={false}
        showDetailLyric={false}
        // onAudioChange={onAudioChange}
        // onVolumeChange={onVolumeChange}
        // lyric={lyric}
        // tLyric={tLyric}
        // lyricLoading={lyricLoading}
        // playListAudioActions={playListAudioActions}
        // actions={[
        //   backward => <Button size={'small'} type="primary" shape="circle" icon="fast-backward"
        //                    onClick={this.props.player.status}/>,
        //   forward => <Button size={'small'} type="primary" shape="circle" icon="fast-forward"
        //                    onClick={this.props.player.status}/>
        // ]}
        // volume={volumeValue}
        detailBackground={<div className={'blur-filter'}></div>}
        // playListHeader={{
        //   headerLeft: 'Play List',
        //   headerRight: <span onClick={onPlayListHide} className={'close-play-list'}>Close</span>
        // }}
        // onModeChange={(currentMode: PlayModeTypes, prevMode: PlayModeTypes) => {
        //   console.log('currentMode:', currentMode, 'prevMode:', prevMode)
        //   setCurrentPlayMode(currentMode)
        // }}
        // onPlayStatusChange={(currentAudio: IAudio, isPlayed: boolean) => {
        //   // console.log('currentAudio:', currentAudio, 'isPlayed:', isPlayed)
        //   setPlaying(isPlayed)
        // }}
        showPlayDetail={false}
        showLyricMini={false}
        playListShow={false}
        playDetailShow={false}
        // onPlayListStatusChange={(status: boolean) => {
        //   setPlayListShow(status)
        // }}
        // onPlayDetailStatusChange={(status: boolean) => {
        //   setPlayDetailShow(status)
        // }}
        // playMode={playMode}
        // detailActionTopRight={detailActionTopRight}
        // detailActionsBottom={detailActionsBottom}
      />
    </Footer>;
  }
};
