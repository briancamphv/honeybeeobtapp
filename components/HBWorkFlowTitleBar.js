import * as React from "react";

import { Appbar } from "react-native-paper";


const HBWorkFlowTitleBar = ({ title, help }) => (
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title={title} />
    <Appbar.Action icon="menu" onPress={() => {}} />
    <Appbar.Action icon="help" onPress={help} />
  </Appbar.Header>
);

export default HBWorkFlowTitleBar;
