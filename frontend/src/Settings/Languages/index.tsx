import React, { FunctionComponent, useState } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";

import { LanguageSelector } from "../../Components";

import { forcedOptions } from "../../utilites/global";

import {
  Group,
  Message,
  Input,
  Check,
  Selector,
  CollapseBox,
} from "../Components";

import SettingTemplate from "../Components/template";

interface Props {
  languages: ExtendLanguage[];
  enabled: ExtendLanguage[];
}

function mapStateToProps({ system }: StoreState) {
  return {
    languages: system.languages.items,
    enabled: system.enabledLanguage,
  };
}

const SettingsLanguagesView: FunctionComponent<Props> = ({
  enabled,
  languages,
}) => {
  function getLanguages(codes: string[]): ExtendLanguage[] {
    return codes.flatMap((code) => {
      const res = languages.find((lang) => lang.code2 === code);
      if (res === undefined) {
        return [];
      } else {
        return res;
      }
    });
  }

  const [avaliable, setAvaliable] = useState(enabled);

  return (
    <SettingTemplate title="Languages - Bazarr (Settings)">
      {(settings, update) => (
        <Container>
          <Group header="Subtitles Language">
            <Input>
              <Check
                label="Single Language"
                defaultValue={settings.general.single_language}
                onChange={(v) => update(v, "settings-general-single_language")}
              ></Check>
              <Message type="info">
                Download a single Subtitles file without adding the language
                code to the filename.
              </Message>
              <Message type="warning">
                We don't recommend enabling this option unless absolutely
                required (ie: media player not supporting language code in
                subtitles filename). Results may vary.
              </Message>
            </Input>
            <Input name="Enabled Languages">
              <LanguageSelector
                multiply
                defaultSelect={enabled}
                options={languages}
                onChange={(val: ExtendLanguage[]) => {
                  setAvaliable(val);
                  const langs = val.map((v) => v.code2);
                  update(langs, "enabled_languages");
                }}
              ></LanguageSelector>
            </Input>
          </Group>
          <Group header="Default Settings">
            <CollapseBox
              indent
              defaultOpen={settings.general.serie_default_enabled}
              control={(change) => (
                <Input>
                  <Check
                    label="Series"
                    defaultValue={settings.general.serie_default_enabled}
                    onChange={(v) => {
                      change(v);
                      update(v, "settings-general-serie_default_enabled");
                    }}
                  ></Check>
                  <Message type="info">
                    Apply only to Series added to Bazarr after enabling this
                    option.
                  </Message>
                </Input>
              )}
            >
              <Input name="Languages">
                <LanguageSelector
                  multiply
                  options={avaliable}
                  defaultSelect={getLanguages(
                    settings.general.serie_default_language
                  )}
                  onChange={(val: ExtendLanguage[]) => {
                    const langs = val.map((v) => v.code2);
                    update(langs, "settings-general-serie_default_language");
                  }}
                ></LanguageSelector>
              </Input>
              <Input name="Forced">
                <Selector
                  defaultKey={settings.general.serie_default_forced}
                  options={forcedOptions}
                  onSelect={(v) =>
                    update(v, "settings-general-serie_default_forced")
                  }
                ></Selector>
              </Input>
              <Input>
                <Check
                  label="Hearing-Impaired"
                  defaultValue={settings.general.serie_default_hi}
                  onChange={(v) =>
                    update(v, "settings-general-serie_default_hi")
                  }
                ></Check>
              </Input>
            </CollapseBox>
            <CollapseBox
              indent
              defaultOpen={settings.general.movie_default_enabled}
              control={(change) => (
                <Input>
                  <Check
                    label="Movies"
                    defaultValue={settings.general.movie_default_enabled}
                    onChange={(v) => {
                      change(v);
                      update(v, "settings-general-movie_default_enabled");
                    }}
                  ></Check>
                  <Message type="info">
                    Apply only to Movies added to Bazarr after enabling this
                    option.
                  </Message>
                </Input>
              )}
            >
              <Input name="Languages">
                <LanguageSelector
                  multiply
                  options={avaliable}
                  defaultSelect={getLanguages(
                    settings.general.movie_default_language
                  )}
                  onChange={(val: ExtendLanguage[]) => {
                    const langs = val.map((v) => v.code2);
                    update(langs, "settings-general-movie_default_language");
                  }}
                ></LanguageSelector>
              </Input>
              <Input name="Forced">
                <Selector
                  options={forcedOptions}
                  defaultKey={settings.general.movie_default_forced}
                  onSelect={(v) =>
                    update(v, "settings-general-movie_default_forced")
                  }
                ></Selector>
              </Input>
              <Input>
                <Check
                  label="Hearing-Impaired"
                  defaultValue={settings.general.movie_default_hi}
                  onChange={(v) =>
                    update(v, "settings-general-movie_default_hi")
                  }
                ></Check>
              </Input>
            </CollapseBox>
          </Group>
        </Container>
      )}
    </SettingTemplate>
  );
};

export default connect(mapStateToProps, {})(SettingsLanguagesView);
