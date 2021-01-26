import React, { FunctionComponent, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { UpdateProvider } from "../../@redux/actions";

import { faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ContentHeader } from "../../components";

import { ProvidersApi } from "../../apis";

import Table from "./table";

interface Props {
  loading: boolean;
  update: () => void;
}

function mapStateToProps({ system }: StoreState) {
  const { providers } = system;
  return {
    loading: providers.updating,
  };
}

const SystemProvidersView: FunctionComponent<Props> = (props) => {
  const { loading, update } = props;

  useEffect(() => {
    update();
  }, [update]);

  const [resetting, setReset] = useState(false);

  return (
    <Container fluid>
      <Helmet>
        <title>Providers - Bazarr (System)</title>
      </Helmet>
      <ContentHeader>
        <ContentHeader.Button updating={loading} icon={faSync} onClick={update}>
          Refresh
        </ContentHeader.Button>
        <ContentHeader.Button
          icon={faTrash}
          updating={resetting}
          onClick={() => {
            setReset(true);
            ProvidersApi.reset().finally(() => {
              setReset(false);
              update();
            });
          }}
        >
          Reset
        </ContentHeader.Button>
      </ContentHeader>
      <Row>
        <Table></Table>
      </Row>
    </Container>
  );
};

export default connect(mapStateToProps, { update: UpdateProvider })(
  SystemProvidersView
);
