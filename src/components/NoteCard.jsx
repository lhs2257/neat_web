function starArr(r) {
  return [1, 2, 3, 4, 5].map(i =>
    r >= i ? 'full' : r >= i - 0.5 ? 'half' : 'empty'
  );
}

export default function NoteCard({ note, onClick, onLike }) {
  const grad = `linear-gradient(158deg,hsl(${note.hue},46%,33%),hsl(${note.hue - 8},58%,15%))`;

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(note.id);
  };

  const photoStyle = note.img
    ? { backgroundImage: `url(${note.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: grad };

  return (
    <div
      className="frame"
      style={{ left: note.x, top: note.y, transform: `rotate(${note.rot}deg)` }}
      onClick={() => onClick(note.id)}
    >
      <div className="photo" style={photoStyle}>
        <span className="badge">{note.category}</span>
        <span className="wm">NEAT</span>
        <div className="photo-grad" />
        <div className="photo-cap">
          <div className="pname">{note.name}</div>
          <div className="prate">
            ★ {note.rating.toFixed(1)} · {note.years}
          </div>
        </div>
      </div>
      <div className="fbody">
        <div className="npf"><b>N</b> {note.nose.slice(0, 2).join(' · ')}</div>
        <div className="npf"><b>P</b> {note.palate.slice(0, 2).join(' · ')}</div>
        <div className="npf"><b>F</b> {note.finish.slice(0, 2).join(' · ')}</div>
        <div className="fmeta">
          <span className="handle">{note.handle}</span>
          <button className={`like ${note.liked ? 'on' : ''}`} onClick={handleLike}>
            ♥ {note.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

export { starArr };
