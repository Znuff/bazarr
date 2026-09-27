from types import SimpleNamespace

from bazarr.subtitles.mass_download import series


def test_episode_search_job_keeps_selected_provider(monkeypatch):
    queued = {}
    monkeypatch.setattr(
        series.jobs_queue,
        "feed_jobs_pending_queue",
        lambda **kwargs: queued.update(kwargs) or 123,
    )

    job_id = series.episode_download_specific_subtitles(
        sonarr_series_id=1,
        sonarr_episode_id=2,
        language="eng",
        hi="False",
        forced="False",
        provider="opensubtitles",
    )

    assert job_id == 123
    assert queued["kwargs"]["provider"] == "opensubtitles"


def test_episode_search_passes_selected_provider_to_generation(monkeypatch):
    episode = SimpleNamespace(
        path="/series/episode.mkv",
        sceneName=None,
        audio_language="[]",
        season=1,
        episode=1,
        episodeTitle="Pilot",
        title="Example Series",
    )
    generated = []

    monkeypatch.setattr(series.database, "execute", lambda query: SimpleNamespace(first=lambda: episode))
    monkeypatch.setattr(series.path_mappings, "path_replace", lambda path: path)
    monkeypatch.setattr(series.os.path, "exists", lambda path: True)
    monkeypatch.setattr(series.jobs_queue, "update_job_name", lambda **kwargs: None)
    monkeypatch.setattr(series, "get_audio_profile_languages", lambda audio_language: [])
    monkeypatch.setattr(series, "get_profile_id", lambda episode_id: 7)
    monkeypatch.setattr(series, "generate_subtitles", lambda *args, **kwargs: generated.append(kwargs) or iter([]))
    monkeypatch.setattr(series, "event_stream", lambda **kwargs: None)

    series.episode_download_specific_subtitles(
        sonarr_series_id=1,
        sonarr_episode_id=2,
        language="eng",
        hi="False",
        forced="False",
        job_id=99,
        provider="opensubtitles",
    )

    assert generated[0]["provider"] == "opensubtitles"