import renderer from "react-test-renderer";
import CopyEditor from "./copy-editor";
import DateDetection, { Extraction } from "./date-detection";

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

describe("Extraction", () => {
  it("matches snapshot", () => {
    const tree = renderer
      .create(
        <Extraction
          annotated="stop by the post office {{wednesday}} at {{11pm}}"
          date="2023/05/10"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
