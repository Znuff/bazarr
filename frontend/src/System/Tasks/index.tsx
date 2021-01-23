import React from "react";
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { UpdateSystemTasks } from "../../@redux/actions";
import { Helmet } from "react-helmet";

import { ContentHeader, ContentHeaderButton } from "../../components";

import { faSync } from "@fortawesome/free-solid-svg-icons";

import Table from "./table";

interface Props {
  update: () => void;
  loading: boolean;
}

function mapStateToProps({ system }: StoreState) {
  const { tasks } = system;
  return {
    loading: tasks.updating,
  };
}

class SystemTasksView extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.update();
  }

  render(): JSX.Element {
    const { loading, update } = this.props;
    return (
      <Container fluid>
        <Helmet>
          <title>Tasks - Bazarr (System)</title>
        </Helmet>
        <ContentHeader>
          <ContentHeaderButton
            updating={loading}
            icon={faSync}
            onClick={update}
          >
            Refresh
          </ContentHeaderButton>
        </ContentHeader>
        <Row>
          <Table></Table>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { update: UpdateSystemTasks })(
  SystemTasksView
);