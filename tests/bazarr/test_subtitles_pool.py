from bazarr.subtitles import pool


def test_init_pool():
    assert pool._init_pool("movie")


def test_pool_update():
    pool_ = pool._init_pool("movie")
    assert pool._pool_update(pool_, "movie")


def test_get_pool_uses_explicit_provider_without_cached_pool(monkeypatch):
    cached_pool = object()
    scoped_pool = object()
    initialized = []

    def init_pool(media_type, profile_id=None, providers=None):
        initialized.append((media_type, profile_id, providers))
        return scoped_pool

    monkeypatch.setitem(pool._pools, "series_7", cached_pool)
    monkeypatch.setattr(pool, "_init_pool", init_pool)

    result = pool._get_pool("series", 7, providers=["opensubtitles"])

    assert result is scoped_pool
    assert initialized == [("series", 7, ["opensubtitles"])]
    assert pool._pools["series_7"] is cached_pool
    assert pool._get_pool("series", 7) is cached_pool
