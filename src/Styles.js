import {StyleSheet} from 'react-native';

export default function Styles() {
  return StyleSheet.create({
    item: {
      padding: 10,
    },
    primaryText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: 'white',
    },
    primaryTextSmall: {
      fontWeight: 'bold',
      fontSize: 14,
      color: 'white',
    },
    separator: {
      backgroundColor: 'rgb(200, 199, 204)',
      height: StyleSheet.hairlineWidth,
    },
    rightAction: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    input: {
      flex: 9,
      borderColor: 'white',
      borderWidth: 2,
      fontSize: 18,
      color: 'white',
      backgroundColor: '#29435c',
    },
    searchBoxContainer: {
      paddingTop: 10,
      flexDirection: 'row',
    },
    searchResultsContainer: {
      flexDirection: 'column',
    },
    itemContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      overflow: 'hidden',
    },
    card: {
      width: '100%',
      elevation: 1,
      borderRadius: 4,
      shadowRadius: 2,
      shadowOpacity: 0.1,
      alignItems: 'center',
      shadowColor: 'black',
      backgroundColor: 'white',
      shadowOffset: {width: 0, height: 1},
    },
    progress: {
      height: 1,
      width: '100%',
      marginTop: 10,
      flexDirection: 'row',
    },
    rectButton: {
      flex: 1,
      height: 80,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: '#d1d4c9',
    },
    title: {
      fontWeight: 'bold',
      backgroundColor: 'transparent',
    },
    artist: {
      color: '#999',
      backgroundColor: 'transparent',
    },
    button: {
      fontSize: 25,
      textAlignVertical: 'bottom',
    },
    top: {
      paddingBottom: 40,
    },
    container: {
      flex: 1,
      paddingTop: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    settingsContainer: {
      // flex: 1,
      // flexGrow: 1,
      paddingTop: 5,
      paddingBottom: 5,
      flexDirection: 'row',
      paddingRight: 5,
      paddingLeft: 5,
    },
    icon: {
      color: '#FFFFFF',
    },
  });
}
