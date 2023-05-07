import renderer from "react-test-renderer";
import CopyEditor from "./copy-editor";
import DateDetection from "./date-detection";

describe("CopyEditor", () => {
  it("matches snapshot", () => {
    const tree = renderer.create(<CopyEditor />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("DateDetection", () => {
  it("matches snapshot", () => {
    const tree = renderer.create(<DateDetection />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
