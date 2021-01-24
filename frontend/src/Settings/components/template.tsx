import React, { FunctionComponent, useCallback, useState } from "react";
import { Prompt } from "react-router";
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import {
  ContentHeader,
  ContentHeaderButton,
  AsyncStateOverlay,
} from "../../components";

import { faSave } from "@fortawesome/free-solid-svg-icons";

import { SystemApi } from "../../apis";

import { UpdateAfterSettings } from "../../@redux/actions";

export type UpdateFunctionType = (v: any, k?: string) => void;

export const ChangeContext = React.createContext<LooseObject>({});

export const UpdateContext = React.createContext<UpdateFunctionType>(
  (v: any, k?: string) => {}
);

interface Props {
  title: string;
  settings: AsyncState<SystemSettings | undefined>;
  update: () => void;
  children: (
    settings: SystemSettings,
    update: UpdateFunctionType,
    change: LooseObject
  ) => JSX.Element;
}

function mapStateToProps({ system }: StoreState) {
  return {
    settings: system.settings,
  };
}

const SettingsSubtitlesView: FunctionComponent<Props> = (props) => {
  const { settings, children, title, update } = props;

  const [willChange, setWillChange] = useState<LooseObject>({});

  const [updating, setUpdating] = useState(false);

  const updateChange = useCallback<UpdateFunctionType>(
    (v: any, k?: string) => {
      if (k) {
        willChange[k] = v;

        if (process.env.NODE_ENV === "development") {
          console.log("stage settings", willChange);
        }
        setWillChange({ ...willChange });
      }
    },
    [willChange]
  );

  const submit = useCallback(() => {
    setUpdating(true);
    SystemApi.setSettings(willChange).finally(() => {
      setWillChange({});
      setUpdating(false);
      update();
    });
  }, [willChange, update]);

  return (
    <AsyncStateOverlay state={settings}>
      {(item) => (
        <Container fluid>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Prompt
            when={Object.keys(willChange).length > 0}
            message="You have unsaved changes, are you sure you want to leave?"
          ></Prompt>
          <ContentHeader>
            <ContentHeaderButton
              icon={faSave}
              updating={updating}
              disabled={Object.keys(willChange).length === 0}
              onClick={submit}
            >
              Save
            </ContentHeaderButton>
          </ContentHeader>
          <UpdateContext.Provider value={updateChange}>
            <Row className="p-4">
              {children(item, updateChange, willChange)}
            </Row>
          </UpdateContext.Provider>
        </Container>
      )}
    </AsyncStateOverlay>
  );
};

export default connect(mapStateToProps, { update: UpdateAfterSettings })(
  SettingsSubtitlesView
);
