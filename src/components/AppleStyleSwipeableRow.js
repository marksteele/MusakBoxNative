/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useRef} from 'react';
import {Animated, View} from 'react-native';
import {GlobalContext} from '../state/GlobalState';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../Styles';

const styles = Styles();

const AppleStyleSwipeableRow = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);
  const container = useRef(null);
  const renderRightAction = (x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      container.current.close();
      // dispatch remove
      dispatch({type: 'removeFromQueue', key: props.item.key});
    };
    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton style={styles.rightAction} onPress={pressHandler}>
          <Icon name="playlist-remove" size={40} />
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (progress) => (
    <View
      style={{
        width: 80,
        flexDirection: 'row',
      }}>
      {renderRightAction(64, progress)}
    </View>
  );

  return (
    <Swipeable
      ref={container}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}>
      {props.children}
    </Swipeable>
  );
};

export default AppleStyleSwipeableRow;
