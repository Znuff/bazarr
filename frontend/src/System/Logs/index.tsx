import React from "react";
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { UpdateSystemLogs } from "../../@redux/actions";

import { faSync, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { ContentHeader, ContentHeaderButton } from "../../Components";

import Table from "./table";

interface Props {
  loading: boolean;
  update: () => void;
}

function mapStateToProps({ system }: StoreState) {
  const { logs } = system;
  return {
    loading: logs.updating,
  };
}

class SystemLogsView extends React.Component<Props> {
  componentDidMount() {
    this.props.update();
  }
  render(): JSX.Element {
    const { loading, update } = this.props;
    return (
      <Container fluid>
        <Helmet>
          <title>Providers - Bazarr (System)</title>
        </Helmet>
        <Row>
          <ContentHeader>
            <ContentHeaderButton
              iconProps={{ icon: faSync, spin: loading }}
              disabled={loading}
              onClick={update}
            >
              Refresh
            </ContentHeaderButton>
            <ContentHeaderButton iconProps={{ icon: faDownload }}>
              Download
            </ContentHeaderButton>
            <ContentHeaderButton iconProps={{ icon: faTrash }}>
              Reset
            </ContentHeaderButton>
          </ContentHeader>
        </Row>
        <Row>
          <Table></Table>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { update: UpdateSystemLogs })(
  SystemLogsView
);
