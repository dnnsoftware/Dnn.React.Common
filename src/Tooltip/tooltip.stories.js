import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import Tooltip from "./index";

storiesOf("Tooltip", module).add("error with only required props", () => (
  <div style={{marginTop:100, marginLeft:100}}>
    <Tooltip
      type="error"
      messages={["Tooltip message"]}
      tooltipPlace="top"
    />
  </div>
));

storiesOf("Tooltip", module).add("warning list on bottom", () => (
  <div style={{marginTop:100, marginLeft:100}}>
    <Tooltip
      type="warning"
      messages={["This tooltip message is longer", "and is an array", "with 3 strings","it shows as a list of items"]}
      tooltipPlace="bottom"
    />
  </div>
));

storiesOf("Tooltip", module).add("info with long message and maxWidth on bottom", () => (
  <div style={{marginTop:100, marginLeft:100}}>
    <Tooltip
      type="info"
      messages={["This is a longer message but it should be limited to 50px wide"]}
      rendered={true}
      tooltipPlace="bottom"
      maxWidth={50}
    />
  </div>
));

storiesOf("Tooltip", module).add("global setting and delayhide", () => (
  <div style={{marginTop:100, marginLeft:100}}>
    <Tooltip
      type="global"
      messages={["This tooltip should hide just after 3 seconds of leaving it"]}
      rendered={true}
      tooltipPlace="top"
      delayHide={3000}
    />
  </div>
));

storiesOf("Tooltip", module).add("not rendered", () => (
  <DynamicRenderedTooltip />
));

class DynamicRenderedTooltip extends Component {
  constructor(){
    super();
    this.state = {rendered: false};
  }

  handleToggleRender(){
    this.setState({rendered: !this.state.rendered});
  }

  render(){
    return(
      <div style={{marginTop:100, marginLeft:100}}>
        <p>This tooltip should not be rendered until you click the button</p>
        <button onClick={this.handleToggleRender.bind(this)}>Toggle render of the tootip</button>
        <Tooltip
          type="global"
          messages={["This tooltip renders dynamically"]}
          rendered={this.state.rendered}
          tooltipPlace="top"
        />
      </div>
    );
  }
}


//    ---------- TOOLTIP AVAILABLE PROPS ---------------
//
// Tooltip.propTypes = {
//   messages: PropTypes.array.isRequired,
//   type: PropTypes.oneOf(["error", "warning", "info", "global"]).isRequired,
//   rendered: PropTypes.bool,
//   tooltipPlace: PropTypes.oneOf(["top", "bottom"]).isRequired,
//   style: PropTypes.object,
//   tooltipStyle: PropTypes.object,
//   tooltipColor: PropTypes.string,
//   className: PropTypes.string,
//   delayHide: PropTypes.number,
//   customIcon: PropTypes.node,
//   tooltipClass: PropTypes.string,
//   onClick: PropTypes.func,
//   maxWidth: PropTypes.number
// };

// Tooltip.defaultProps = {
//   tooltipPlace: "top",
//   type: "info",
//   delayHide: 100,
//   maxWidth: 400
// };